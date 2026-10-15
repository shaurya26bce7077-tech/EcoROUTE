"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";
import { supabase } from "@/lib/supabase";
import type { Listing } from "@/types";

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  useEffect(() => {
    supabase.from("listings").select("*").order("created_at", { ascending: false }).then(({ data }) => setListings((data ?? []) as Listing[]));
  }, []);
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-6 flex items-center justify-between"><div><h1 className="text-3xl font-bold">All listings</h1><p className="mt-1 text-zinc-500">Manage and explore surplus food.</p></div><Link href="/dashboard/listings/new" className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950">+ New listing</Link></div>
        <div className="grid gap-4 md:grid-cols-2">{listings.map((x) => <ListingCard key={x.id} listing={x} />)}</div>
      </section>
    </main>
  );
}
