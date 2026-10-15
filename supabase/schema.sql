-- EcoRoute MVP database
-- No Supabase Auth is used in this hackathon version.
-- Run this after dropping the old demo tables if you are resetting the project.

create extension if not exists pgcrypto;

drop function if exists public.claim_listing(uuid, text);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  title text not null,
  description text not null,
  category text not null default 'general',
  quantity integer not null check (quantity > 0),
  address text not null,
  lat numeric(9,6) not null,
  lng numeric(9,6) not null,
  is_free boolean not null default true,
  price numeric(10,2),
  expiry_time timestamptz not null,
  pickup_window text not null,
  status text not null default 'available'
    check (status in ('available','reserved','picked_up','expired')),
  created_at timestamptz not null default now()
);

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

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  consumer_id text not null,
  consumer_name text not null,
  status text not null default 'reserved'
    check (status in ('reserved','picked_up','cancelled','no_show')),
  claimed_at timestamptz not null default now()
);

create index if not exists idx_listings_status on public.listings(status);
create index if not exists idx_listings_created_at on public.listings(created_at desc);
create index if not exists idx_listings_lat_lng on public.listings(lat, lng);
create index if not exists idx_claims_listing_id on public.claims(listing_id);
create index if not exists idx_claims_consumer_id on public.claims(consumer_id);
create index if not exists idx_consumer_profiles_consumer_id on public.consumer_profiles(consumer_id);

alter table public.listings enable row level security;
alter table public.claims enable row level security;
alter table public.consumer_profiles enable row level security;

drop policy if exists "public_read_listings" on public.listings;
create policy "public_read_listings" on public.listings for select to anon, authenticated using (true);
drop policy if exists "public_create_listings" on public.listings;
create policy "public_create_listings" on public.listings for insert to anon, authenticated with check (true);
drop policy if exists "public_update_listings" on public.listings;
create policy "public_update_listings" on public.listings for update to anon, authenticated using (true) with check (true);

drop policy if exists "public_read_claims" on public.claims;
create policy "public_read_claims" on public.claims for select to anon, authenticated using (true);
drop policy if exists "public_create_claims" on public.claims;
create policy "public_create_claims" on public.claims for insert to anon, authenticated with check (true);
drop policy if exists "public_update_claims" on public.claims;
create policy "public_update_claims" on public.claims for update to anon, authenticated using (true) with check (true);

drop policy if exists "public_read_consumer_profiles" on public.consumer_profiles;
create policy "public_read_consumer_profiles" on public.consumer_profiles for select to anon, authenticated using (true);
drop policy if exists "public_insert_consumer_profiles" on public.consumer_profiles;
create policy "public_insert_consumer_profiles" on public.consumer_profiles for insert to anon, authenticated with check (true);
drop policy if exists "public_update_consumer_profiles" on public.consumer_profiles;
create policy "public_update_consumer_profiles" on public.consumer_profiles for update to anon, authenticated using (true) with check (true);

-- Atomic claim: reserves only an available, non-expired listing.
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
  if trim(coalesce(p_consumer_id, '')) = '' then raise exception 'Consumer ID is required'; end if;
  if trim(coalesce(p_consumer_name, '')) = '' then raise exception 'Name is required'; end if;

  insert into public.consumer_profiles (consumer_id, name)
  values (trim(p_consumer_id), trim(p_consumer_name))
  on conflict (consumer_id) do update set name = excluded.name, updated_at = now();

  update public.listings
  set status = 'reserved'
  where id = p_listing_id and status = 'available' and expiry_time > now();

  if not found then raise exception 'This listing is no longer available'; end if;

  insert into public.claims (listing_id, consumer_id, consumer_name, status)
  values (p_listing_id, trim(p_consumer_id), trim(p_consumer_name), 'reserved')
  returning * into v_claim;

  update public.consumer_profiles
  set total_claims = total_claims + 1, updated_at = now()
  where consumer_id = trim(p_consumer_id);

  return v_claim;
end;
$$;

grant execute on function public.claim_listing(uuid, text, text) to anon, authenticated;

-- Successful pickup: +2 reliability points, capped at 100.
create or replace function public.mark_claim_picked_up(p_claim_id uuid, p_consumer_id text)
returns public.claims
language plpgsql security definer set search_path = public
as $$
declare v_claim public.claims;
begin
  update public.claims set status = 'picked_up'
  where id = p_claim_id and consumer_id = trim(p_consumer_id) and status = 'reserved'
  returning * into v_claim;
  if not found then raise exception 'Claim is not active or does not belong to this device'; end if;

  update public.listings set status = 'picked_up' where id = v_claim.listing_id;
  update public.consumer_profiles
  set successful_pickups = successful_pickups + 1,
      reliability_score = least(100, reliability_score + 2),
      updated_at = now()
  where consumer_id = trim(p_consumer_id);
  return v_claim;
end;
$$;

grant execute on function public.mark_claim_picked_up(uuid, text) to anon, authenticated;

-- Demo no-show action: -20 reliability points, minimum 0.
-- In production, the store should confirm this instead of the consumer.
create or replace function public.mark_claim_no_show(p_claim_id uuid, p_consumer_id text)
returns public.claims
language plpgsql security definer set search_path = public
as $$
declare v_claim public.claims;
begin
  update public.claims set status = 'no_show'
  where id = p_claim_id and consumer_id = trim(p_consumer_id) and status = 'reserved'
  returning * into v_claim;
  if not found then raise exception 'Claim is not active or does not belong to this device'; end if;

  update public.listings set status = 'expired' where id = v_claim.listing_id;
  update public.consumer_profiles
  set no_shows = no_shows + 1,
      reliability_score = greatest(0, reliability_score - 20),
      updated_at = now()
  where consumer_id = trim(p_consumer_id);
  return v_claim;
end;
$$;

grant execute on function public.mark_claim_no_show(uuid, text) to anon, authenticated;
