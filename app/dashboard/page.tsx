"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Leaf, Package, TrendingDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { supabase } from "@/lib/supabase";
import type { Claim, Listing } from "@/types";

export default function DashboardPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from("listings").select("*"),
      supabase.from("claims").select("*"),
    ]).then(([l, c]) => {
      setListings((l.data ?? []) as Listing[]);
      setClaims((c.data ?? []) as Claim[]);
    });
  }, []);

  const foodSaved = useMemo(() => listings.reduce((sum, x) => sum + Number(x.quantity || 0), 0), [listings]);
  const completed = claims.filter((x) => x.status === "picked_up").length;
  const active = listings.filter((x) => x.status === "available").length;
  const co2 = (foodSaved * 2.5).toFixed(1);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-medium text-emerald-400">IMPACT CENTER</p><h1 className="mt-1 text-3xl font-bold md:text-4xl">EcoRoute dashboard</h1><p className="mt-2 text-zinc-400">See the impact created by every rescued item.</p></div>
          <Link href="/dashboard/listings/new" className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950">+ Post surplus</Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Food rescued" value={`${foodSaved} items`} icon={<Package size={18} />} hint="Total quantity listed" />
          <StatCard label="Claims" value={claims.length} icon={<CheckCircle2 size={18} />} hint={`${completed} completed pickups`} />
          <StatCard label="Active listings" value={active} icon={<Leaf size={18} />} hint="Available right now" />
          <StatCard label="CO₂ avoided" value={`${co2} kg`} icon={<TrendingDown size={18} />} hint="Demo estimate: 2.5 kg/item" />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-xl font-semibold">How EcoRoute creates impact</h2>
            <div className="mt-6 space-y-5">
              {[
                ["01", "Stores post surplus", "Food nearing expiry gets a second chance instead of entering the waste stream."],
                ["02", "People claim nearby", "Consumers discover available food on a live local map and reserve it."],
                ["03", "Pickup completes the loop", "Every completed claim contributes to measurable waste reduction."],
              ].map(([n, t, d]) => <div key={n} className="flex gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-400/10 text-sm font-bold text-emerald-400">{n}</span><div><h3 className="font-medium">{t}</h3><p className="mt-1 text-sm leading-6 text-zinc-500">{d}</p></div></div>)}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <p className="text-sm text-emerald-300">HACKATHON DEMO</p>
            <h2 className="mt-2 text-2xl font-bold">One local action. Three wins.</h2>
            <div className="mt-5 space-y-3 text-sm text-zinc-300">
              <p>🌱 Less food waste</p><p>💰 New value for stores</p><p>🤝 Better access for communities</p>
            </div>
            <Link href="/map" className="mt-7 block rounded-xl bg-emerald-400 px-4 py-3 text-center font-semibold text-zinc-950">Open live map →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
