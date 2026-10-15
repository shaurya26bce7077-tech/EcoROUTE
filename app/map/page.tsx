"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LocateFixed, MapPin, Search, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";
import ClaimStatusPanel from "@/components/ClaimStatusPanel";
import { supabase } from "@/lib/supabase";
import { getConsumerId } from "@/lib/consumer";
import type { Claim, Listing } from "@/types";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

type City = { name: string; lat: number; lng: number };
const INDIA_CENTER: [number, number] = [22.5937, 78.9629];
const CITIES: City[] = [
  { name: "Delhi", lat: 28.6139, lng: 77.209 }, { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 }, { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 }, { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 }, { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 }, { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Vijayawada", lat: 16.5062, lng: 80.648 }, { name: "Amaravati", lat: 16.573, lng: 80.3575 },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794 }, { name: "Kochi", lat: 9.9312, lng: 76.2673 },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
];

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export default function MapPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>(INDIA_CENTER);
  const [mapZoom, setMapZoom] = useState(5);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearMe, setNearMe] = useState(false);
  const [claimed, setClaimed] = useState<{ claim: Claim; listing: Listing } | null>(null);

  async function load() {
    const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (error) setMessage(error.message);
    else setListings((data ?? []) as Listing[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = listings.filter((x) => !q || [x.title, x.description, x.category, x.store_name, x.address].some((v) => v.toLowerCase().includes(q)))
      .map((x) => ({ ...x, distanceKm: userLocation ? distanceKm(userLocation.lat, userLocation.lng, Number(x.lat), Number(x.lng)) : undefined }));
    if (nearMe && userLocation) result = result.filter((x) => (x.distanceKm ?? Infinity) <= 50).sort((a,b) => (a.distanceKm ?? Infinity)-(b.distanceKm ?? Infinity));
    return result;
  }, [listings, query, nearMe, userLocation]);

  function chooseCity(city: City) { setMapCenter([city.lat, city.lng]); setMapZoom(11); setSelectedId(undefined); setNearMe(false); setMessage(`Showing surplus around ${city.name}.`); }

  function useMyLocation() {
    if (!navigator.geolocation) { setMessage("Location is not supported by this browser."); return; }
    setMessage("Finding your location...");
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude }); setMapCenter([latitude, longitude]); setMapZoom(12); setNearMe(true);
      setMessage("Showing surplus within 50 km of your location.");
    }, () => setMessage("Location permission was not granted. You can choose a city instead."));
  }

  async function claim(id: string) {
    setClaiming(id); setMessage("");
    const name = window.prompt("Enter your name for the pickup:", "EcoRoute User");
    if (!name?.trim()) { setClaiming(null); return; }
    const { data, error } = await supabase.rpc("claim_listing", { p_listing_id: id, p_consumer_id: getConsumerId(), p_consumer_name: name.trim() });
    if (error) setMessage(error.message);
    else {
      const item = listings.find((x) => x.id === id);
      if (item) setClaimed({ claim: data as Claim, listing: item });
      setMessage("Food claimed! You can now get directions to the store.");
      setListings((prev) => prev.map((x) => x.id === id ? { ...x, status: "reserved" } : x));
    }
    setClaiming(null);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-emerald-400">INDIA-WIDE SURPLUS MAP</p><h1 className="mt-1 text-3xl font-bold md:text-4xl">Find food near you</h1><p className="mt-2 text-zinc-400">Discover surplus food across India before it becomes waste.</p></div><Link href="/dashboard/listings/new" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">+ Post surplus</Link></div>
        {message && <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}
        {claimed && <div className="mb-5"><ClaimStatusPanel claim={claimed.claim} storeName={claimed.listing.store_name} title={claimed.listing.title} lat={Number(claimed.listing.lat)} lng={Number(claimed.listing.lng)} address={claimed.listing.address} onChanged={(status) => { setClaimed((prev) => prev ? { ...prev, claim: { ...prev.claim, status } } : prev); load(); }} /></div>}
        <div className="mb-5 flex flex-wrap gap-2"><button onClick={useMyLocation} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-300"><LocateFixed size={16}/> Near me</button>{CITIES.slice(0,8).map((city)=><button key={city.name} onClick={()=>chooseCity(city)} className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-600">{city.name}</button>)}</div>
        <div className="mb-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3"><div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500"><MapPin size={14}/> Explore more cities</div><div className="flex flex-wrap gap-2">{CITIES.slice(8).map((city)=><button key={city.name} onClick={()=>chooseCity(city)} className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-100">{city.name}</button>)}</div></div>
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="order-2 space-y-4 lg:order-1"><div className="flex gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-2"><Search className="ml-2 mt-2 text-zinc-500" size={18}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search food, store or city..." className="w-full bg-transparent px-2 py-1.5 outline-none placeholder:text-zinc-600"/><SlidersHorizontal className="mt-2 mr-2 text-zinc-500" size={18}/></div><div className="flex items-center gap-2 text-sm text-zinc-500"><MapPin size={15}/> {filtered.length} surplus listings found{nearMe ? " within 50 km" : " across the demo network"}</div>{loading ? <div className="rounded-2xl border border-zinc-800 p-8 text-center text-zinc-500">Loading listings...</div> : filtered.length ? filtered.map((item)=><div key={item.id} onClick={()=>setSelectedId(item.id)} className="cursor-pointer"><ListingCard listing={item} distanceKm={item.distanceKm} onClaim={claim} claiming={claiming===item.id}/></div>) : <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center text-zinc-500">No matching surplus here yet. Try another city.</div>}</div>
          <div className="order-1 h-[520px] overflow-hidden rounded-2xl border border-zinc-800 lg:sticky lg:top-24 lg:order-2"><MapView listings={filtered} selectedId={selectedId} center={mapCenter} zoom={mapZoom} onSelect={setSelectedId} userLocation={userLocation}/></div>
        </div>
      </section>
    </main>
  );
}
