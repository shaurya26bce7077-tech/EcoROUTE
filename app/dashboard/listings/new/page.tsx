import Link from "next/link";
import Navbar from "@/components/Navbar";
import CreateListingForm from "@/components/CreateListingForm";

export default function NewListingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <section className="mx-auto max-w-3xl px-5 py-10">
        <Link href="/map" className="text-sm text-zinc-500 hover:text-white">← Back to map</Link>
        <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 md:p-8">
          <p className="text-sm font-medium text-emerald-400">FOR LOCAL STORES</p>
          <h1 className="mt-1 text-3xl font-bold">Post surplus food</h1>
          <p className="mt-2 text-zinc-400">Turn food that would be wasted into value for someone nearby.</p>
          <div className="mt-7"><CreateListingForm /></div>
        </div>
      </section>
    </main>
  );
}
