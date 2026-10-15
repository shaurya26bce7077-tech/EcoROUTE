"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Navigation, Star, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { getConsumerId, getReliabilityLabel } from "@/lib/consumer";
import type { Claim, ConsumerProfile, Listing } from "@/types";

export default function MyClaimsPage() {
  const [profile, setProfile] = useState<ConsumerProfile | null>(null);
  const [claims, setClaims] = useState<(Claim & { listing?: Listing })[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const consumerId = getConsumerId();
    if (!consumerId) return;
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("consumer_profiles").select("*").eq("consumer_id", consumerId).maybeSingle(),
      supabase.from("claims").select("*").eq("consumer_id", consumerId).order("claimed_at", { ascending: false }),
    ]);
    setProfile((p ?? null) as ConsumerProfile | null);
    const rawClaims = (c ?? []) as Claim[];
    if (!rawClaims.length) { setClaims([]); return; }
    const ids = rawClaims.map((x) => x.listing_id);
    const { data: listings } = await supabase.from("listings").select("*").in("id", ids);
    const byId = new Map(((listings ?? []) as Listing[]).map((x) => [x.id, x]));
    setClaims(rawClaims.map((x) => ({ ...x, listing: byId.get(x.listing_id) })));
  }

  useEffect(() => { load(); }, []);

  function directions(lat: number, lng: number) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`, "_blank", "noopener,noreferrer");
  }

  async function updateClaim(claim: Claim, action: "picked_up" | "no_show") {
    setBusy(claim.id);
    setMessage("");
    const fn = action === "picked_up" ? "mark_claim_picked_up" : "mark_claim_no_show";
    const { error } = await supabase.rpc(fn, { p_claim_id: claim.id, p_consumer_id: getConsumerId() });
    if (error) setMessage(error.message);
    else {
      setMessage(action === "picked_up" ? "Pickup recorded." : "No-show recorded. Reliability score decreased.");
      await load();
    }
    setBusy(null);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-medium text-emerald-400">CONSUMER PROFILE</p><h1 className="mt-1 text-3xl font-bold">My claims & reliability</h1><p className="mt-2 text-zinc-400">Complete pickups to maintain a strong reliability score.</p></div>
          {profile && <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3"><div className="flex items-center gap-2 text-xs text-zinc-400"><Star size={14} /> Reliability score</div><div className="text-3xl font-bold text-emerald-300">{Number(profile.reliability_score).toFixed(0)}%</div><div className="text-xs text-zinc-500">{getReliabilityLabel(Number(profile.reliability_score))}</div></div>}
        </div>

        {profile && <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"><div className="text-2xl font-bold">{profile.total_claims}</div><div className="text-xs text-zinc-500">Total claims</div></div><div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"><div className="text-2xl font-bold text-emerald-300">{profile.successful_pickups}</div><div className="text-xs text-zinc-500">Completed pickups</div></div><div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"><div className="text-2xl font-bold text-red-300">{profile.no_shows}</div><div className="text-xs text-zinc-500">No-shows</div></div></div>}
        {message && <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}

        <div className="mt-6 space-y-4">
          {!claims.length ? <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center text-zinc-500">No claims on this browser yet. <Link href="/map" className="text-emerald-400 hover:underline">Find surplus food →</Link></div> : claims.map((claim) => {
            const listing = claim.listing;
            if (!listing) return null;
            return <article key={claim.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs capitalize text-emerald-300">{claim.status.replace("_", " ")}</span><h2 className="mt-3 text-xl font-semibold">{listing.title}</h2><p className="mt-1 text-sm text-zinc-400">{listing.store_name} • {listing.address}</p></div><div className="text-xs text-zinc-500">Claimed {new Date(claim.claimed_at).toLocaleString()}</div></div>
              {claim.status === "reserved" && <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => directions(Number(listing.lat), Number(listing.lng))} className="flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950"><Navigation size={16} /> Get directions</button><button disabled={busy===claim.id} onClick={() => updateClaim(claim,"picked_up")} className="flex items-center gap-2 rounded-lg border border-emerald-500/30 px-4 py-2 text-sm text-emerald-300 disabled:opacity-50"><CheckCircle2 size={16} /> Picked up</button><button disabled={busy===claim.id} onClick={() => updateClaim(claim,"no_show")} className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-300 disabled:opacity-50"><XCircle size={16} /> Didn't pick up</button></div>}
              {claim.status === "picked_up" && <p className="mt-4 flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 size={16}/> Pickup completed — reliability maintained/improved.</p>}
              {claim.status === "no_show" && <p className="mt-4 flex items-center gap-2 text-sm text-red-300"><XCircle size={16}/> No-show — reliability score was reduced.</p>}
            </article>;
          })}
        </div>
      </section>
    </main>
  );
}
