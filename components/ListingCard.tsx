import type { Listing } from "@/types";
import { Clock3, MapPin, Package, Store } from "lucide-react";

export default function ListingCard({
  listing,
  onClaim,
  claiming = false,
  distanceKm,
}: {
  listing: Listing;
  onClaim?: (id: string) => void;
  claiming?: boolean;
  distanceKm?: number;
}) {
  const expired = new Date(listing.expiry_time).getTime() <= Date.now();
  const available = listing.status === "available" && !expired;
  const price = listing.is_free ? "FREE" : `₹${Number(listing.price ?? 0).toFixed(0)}`;

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-emerald-500/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-300">
            {listing.category}
          </span>
          <h3 className="mt-3 text-xl font-semibold">{listing.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{listing.description}</p>
        </div>
        <span className="whitespace-nowrap rounded-xl bg-zinc-950 px-3 py-2 text-sm font-bold text-emerald-300">{price}</span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-zinc-400">
        <div className="flex items-center gap-2"><Store size={15} /> {listing.store_name}</div>
        <div className="flex items-center gap-2"><Package size={15} /> {listing.quantity} portions/items</div>
        <div className="flex items-center gap-2"><MapPin size={15} /> {listing.address}{typeof distanceKm === "number" && <span className="ml-auto rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-300">{distanceKm < 10 ? distanceKm.toFixed(1) : distanceKm.toFixed(0)} km away</span>}</div>
        <div className="flex items-center gap-2"><Clock3 size={15} /> Pickup: {listing.pickup_window}</div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">
        <span className={`text-xs font-medium ${available ? "text-emerald-400" : "text-zinc-500"}`}>
          {expired ? "Expired" : listing.status.replace("_", " ")}
        </span>
        {onClaim && (
          <button
            disabled={!available || claiming}
            onClick={() => onClaim(listing.id)}
            className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {claiming ? "Claiming..." : available ? "Claim food" : "Unavailable"}
          </button>
        )}
      </div>
    </article>
  );
}
