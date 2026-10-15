-- EcoRoute: reliability + pickup/directions upgrade
-- Run this AFTER your existing schema.sql.
-- This does not delete your current listings.

create table if not exists public.consumer_profiles (
  id uuid primary key default gen_random_uuid(),
  consumer_id text not null unique,
  name text not null,
  reliability_score numeric(5,2) not null default 100 check (reliability_score >= 0 and reliability_score <= 100),
  total_claims integer not null default 0,
  successful_pickups integer not null default 0,
  no_shows integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.claims add column if not exists consumer_id text;

-- Allow the new no_show status.
alter table public.claims drop constraint if exists claims_status_check;
alter table public.claims add constraint claims_status_check
  check (status in ('reserved','picked_up','cancelled','no_show'));

create index if not exists idx_claims_consumer_id on public.claims(consumer_id);
create index if not exists idx_consumer_profiles_consumer_id on public.consumer_profiles(consumer_id);

alter table public.consumer_profiles enable row level security;

drop policy if exists "public_read_consumer_profiles" on public.consumer_profiles;
create policy "public_read_consumer_profiles"
on public.consumer_profiles for select to anon, authenticated
using (true);

drop policy if exists "public_insert_consumer_profiles" on public.consumer_profiles;
create policy "public_insert_consumer_profiles"
on public.consumer_profiles for insert to anon, authenticated
with check (true);

drop policy if exists "public_update_consumer_profiles" on public.consumer_profiles;
create policy "public_update_consumer_profiles"
on public.consumer_profiles for update to anon, authenticated
using (true) with check (true);

-- Claim an available listing and create/update the consumer profile.
create or replace function public.claim_listing(
  p_listing_id uuid,
  p_consumer_id text,
  p_consumer_name text
)
returns public.claims
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim public.claims;
begin
  if trim(coalesce(p_consumer_id, '')) = '' then
    raise exception 'Consumer ID is required';
  end if;

  if trim(coalesce(p_consumer_name, '')) = '' then
    raise exception 'Name is required';
  end if;

  insert into public.consumer_profiles (consumer_id, name)
  values (trim(p_consumer_id), trim(p_consumer_name))
  on conflict (consumer_id) do update
    set name = excluded.name,
        updated_at = now();

  update public.listings
  set status = 'reserved'
  where id = p_listing_id
    and status = 'available'
    and expiry_time > now();

  if not found then
    raise exception 'This listing is no longer available';
  end if;

  insert into public.claims (listing_id, consumer_id, consumer_name, status)
  values (p_listing_id, trim(p_consumer_id), trim(p_consumer_name), 'reserved')
  returning * into v_claim;

  update public.consumer_profiles
  set total_claims = total_claims + 1,
      updated_at = now()
  where consumer_id = trim(p_consumer_id);

  return v_claim;
end;
$$;

grant execute on function public.claim_listing(uuid, text, text) to anon, authenticated;

-- Mark a reserved claim as successfully picked up.
create or replace function public.mark_claim_picked_up(
  p_claim_id uuid,
  p_consumer_id text
)
returns public.claims
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim public.claims;
begin
  update public.claims
  set status = 'picked_up'
  where id = p_claim_id
    and consumer_id = trim(p_consumer_id)
    and status = 'reserved'
  returning * into v_claim;

  if not found then
    raise exception 'Claim is not active or does not belong to this device';
  end if;

  update public.listings
  set status = 'picked_up'
  where id = v_claim.listing_id;

  update public.consumer_profiles
  set successful_pickups = successful_pickups + 1,
      reliability_score = least(100, reliability_score + 2),
      updated_at = now()
  where consumer_id = trim(p_consumer_id);

  return v_claim;
end;
$$;

grant execute on function public.mark_claim_picked_up(uuid, text) to anon, authenticated;

-- Demo-friendly no-show action. In production, this should be confirmed by the store.
create or replace function public.mark_claim_no_show(
  p_claim_id uuid,
  p_consumer_id text
)
returns public.claims
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim public.claims;
begin
  update public.claims
  set status = 'no_show'
  where id = p_claim_id
    and consumer_id = trim(p_consumer_id)
    and status = 'reserved'
  returning * into v_claim;

  if not found then
    raise exception 'Claim is not active or does not belong to this device';
  end if;

  update public.listings
  set status = 'expired'
  where id = v_claim.listing_id;

  update public.consumer_profiles
  set no_shows = no_shows + 1,
      reliability_score = greatest(0, reliability_score - 20),
      updated_at = now()
  where consumer_id = trim(p_consumer_id);

  return v_claim;
end;
$$;

grant execute on function public.mark_claim_no_show(uuid, text) to anon, authenticated;
