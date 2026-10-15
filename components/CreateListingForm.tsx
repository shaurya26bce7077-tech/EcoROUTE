"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), { ssr: false });

export default function CreateListingForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    store_name: "Green Leaf Cafe",
    title: "",
    description: "",
    category: "Meals",
    quantity: 10,
    address: "VIT-AP Campus, Amaravati",
    lat: 16.4865,
    lng: 80.5107,
    expiry_time: "",
    pickup_window: "6:00 PM - 8:00 PM",
    is_free: true,
    price: 49,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("listings").insert({
      ...form,
      expiry_time: form.expiry_time || new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      status: "available",
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }
    router.push("/map");
    router.refresh();
  }

  const input = "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-zinc-400">Store / donor name<input className={input + " mt-1.5"} value={form.store_name} onChange={(e) => update("store_name", e.target.value)} required /></label>
        <label className="text-sm text-zinc-400">Food category<input className={input + " mt-1.5"} value={form.category} onChange={(e) => update("category", e.target.value)} required /></label>
      </div>
      <label className="block text-sm text-zinc-400">Food item<input className={input + " mt-1.5"} placeholder="e.g. Fresh veg biryani" value={form.title} onChange={(e) => update("title", e.target.value)} required /></label>
      <label className="block text-sm text-zinc-400">Description<textarea className={input + " mt-1.5"} rows={3} placeholder="What is available?" value={form.description} onChange={(e) => update("description", e.target.value)} required /></label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-zinc-400">Quantity<input type="number" min={1} className={input + " mt-1.5"} value={form.quantity} onChange={(e) => update("quantity", Number(e.target.value))} required /></label>
        <label className="text-sm text-zinc-400">Pickup window<input className={input + " mt-1.5"} value={form.pickup_window} onChange={(e) => update("pickup_window", e.target.value)} required /></label>
      </div>
      <label className="block text-sm text-zinc-400">Pickup address<input className={input + " mt-1.5"} value={form.address} onChange={(e) => update("address", e.target.value)} required /></label>
      <LocationPicker lat={form.lat} lng={form.lng} onChange={(lat, lng) => { update("lat", lat); update("lng", lng); }} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-zinc-400">Expiry time<input type="datetime-local" className={input + " mt-1.5"} value={form.expiry_time} onChange={(e) => update("expiry_time", e.target.value)} /></label>
        <label className="text-sm text-zinc-400">Price<input type="number" min={0} className={input + " mt-1.5"} value={form.price} disabled={form.is_free} onChange={(e) => update("price", Number(e.target.value))} /></label>
      </div>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm">
        <input type="checkbox" checked={form.is_free} onChange={(e) => update("is_free", e.target.checked)} className="h-4 w-4 accent-emerald-400" />
        <span><b>Give it away for free</b><br /><span className="text-zinc-500">Uncheck to offer it at a discounted price.</span></span>
      </label>
      {message && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{message}</p>}
      <button disabled={loading} className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-300 disabled:opacity-50">
        {loading ? "Publishing..." : "Publish surplus listing"}
      </button>
    </form>
  );
}
