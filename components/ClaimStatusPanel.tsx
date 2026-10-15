"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MapPinned, Navigation, Star, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getConsumerId, getReliabilityLabel } from "@/lib/consumer";
import type { Claim, ConsumerProfile } from "@/types";

export default function ClaimStatusPanel({
  claim,
  storeName,
  title,
  lat,
  lng,
  address,
  onChanged,
}: {
  claim: Claim;
  storeName: string;
  title: string;
  lat: number;
  lng: number;
  address: string;
  onChanged?: (status: Claim["status"]) => void;
}) {
  const [profile, setProfile] = useState<ConsumerProfile | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProfile() {
    const id = getConsumerId();
    if (!id) return;
    const { data } = await supabase.from("consumer_profiles").select("*").eq("consumer_id", id).maybeSingle();
    setProfile((data ?? null) as ConsumerProfile | null);
  }

  useEffect(() => { loadProfile(); }, [claim.status]);

  function directions() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function updateStatus(action: "picked_up" | "no_show") {
    setBusy(true);
    setMessage("");
    const fn = action === "picked_up" ? "mark_claim_picked_up" : "mark_claim_no_show";
    const { error } = await supabase.rpc(fn, { p_claim_id: claim.id, p_consumer_id: getConsumerId() });
    if (error) setMessage(error.message);
    else {
      setMessage(action === "picked_up" ? "Pickup completed. Your reliability score improved." : "Marked as a no-show. Your reliability score decreased.");
      onChanged?.(action);
      await loadProfile();
    }
    setBusy(false);
  }

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Claim confirmed</p>
          <h3 className="mt-1 text-xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-zinc-300">{storeName} • {address}</p>
        </div>
        {profile && (
          <div className="rounded-xl bg-zinc-950/60 px-3 py-2 text-right">
            <div className="flex items-center justify-end gap-1 text-xs text-zinc-400"><Star size={13} /> Reliability</div>
            <div className="text-xl font-bold text-emerald-300">{Number(profile.reliability_score).toFixed(0)}%</div>
            <div className="text-[11px] text-zinc-500">{getReliabilityLabel(Number(profile.reliability_score))}</div>
          </div>
        )}
      </div>

      {claim.status === "reserved" && (
        <>
          <button onClick={directions} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-zinc-950 hover:bg-emerald-300">
            <Navigation size={18} /> Get directions to {storeName}
          </button>
          <p className="mt-2 flex items-center gap-2 text-xs text-zinc-400"><MapPinned size={14} /> Opens the destination in Google Maps.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button disabled={busy} onClick={() => updateStatus("picked_up")} className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 px-3 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50"><CheckCircle2 size={16} /> Mark picked up</button>
            <button disabled={busy} onClick={() => updateStatus("no_show")} className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"><XCircle size={16} /> I didn't pick it up</button>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500">Hackathon demo: pickup/no-show is self-reported. In production, the store would confirm pickup.</p>
        </>
      )}

      {claim.status === "picked_up" && <p className="mt-4 text-sm font-medium text-emerald-300">✓ Pickup completed successfully.</p>}
      {claim.status === "no_show" && <p className="mt-4 text-sm font-medium text-red-300">This claim was marked as a no-show. Future reliability is affected.</p>}
      {message && <p className="mt-3 text-xs text-zinc-300">{message}</p>}
    </div>
  );
}
