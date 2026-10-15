import Link from "next/link";
import { ArrowRight, Leaf, MapPin, Recycle, Store, Users, Utensils } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 -z-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-20 md:pt-28">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">♻ Pitch Please • 4-hour ideathon</span>
            <h1 className="mt-7 text-5xl font-black tracking-tight md:text-7xl">Don&apos;t waste food.<br /><span className="text-emerald-400">Route it.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">EcoRoute connects local stores with people nearby to rescue surplus food before it becomes waste.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/map" className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-300">Explore surplus <ArrowRight size={18} /></Link>
              <Link href="/dashboard/listings/new" className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold hover:bg-zinc-900">I&apos;m a store</Link>
            </div>
          </div>
          <div className="mt-16 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
            {[["2.5 kg", "CO₂ est. avoided / item"], ["24/7", "surplus discovery"], ["₹0", "to list surplus"], ["1 map", "for the local community"]].map(([a,b]) => <div key={a} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4"><div className="text-2xl font-bold text-emerald-400">{a}</div><div className="mt-1 text-xs text-zinc-500">{b}</div></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="max-w-2xl"><p className="text-sm font-medium text-emerald-400">THE PROBLEM</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">Good food gets wasted because the right person isn&apos;t there at the right time.</h2><p className="mt-4 text-zinc-400">Small stores have unpredictable surplus. Nearby consumers often don&apos;t know it exists. EcoRoute closes that last-mile information gap.</p></div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[["Stores", "Turn unsold inventory into revenue or community value.", Store], ["Consumers", "Find affordable or free surplus food nearby.", Users], ["Planet", "Keep edible food out of landfills and measure the impact.", Leaf]].map(([title,desc,Icon]) => { const I=Icon as typeof Leaf; return <div key={title as string} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"><I className="text-emerald-400" /><h3 className="mt-5 text-xl font-semibold">{title as string}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{desc as string}</p></div> })}
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="text-center"><p className="text-sm font-medium text-emerald-400">HOW IT WORKS</p><h2 className="mt-2 text-3xl font-bold">From surplus to saved.</h2></div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[["01", Store, "Post", "A store adds surplus food, quantity, price and pickup window."], ["02", MapPin, "Discover", "Nearby people see live listings on the EcoRoute map."], ["03", Utensils, "Claim & pickup", "Claim the food, show your pickup name, and rescue a meal."]].map(([n,Icon,t,d]) => { const I=Icon as typeof Store; return <div key={n as string} className="relative text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400 text-zinc-950"><I /></div><div className="mt-4 text-xs font-bold text-emerald-400">{n as string}</div><h3 className="mt-1 text-xl font-semibold">{t as string}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-zinc-500">{d as string}</p></div> })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center md:p-14"><Recycle className="mx-auto text-emerald-400" size={32} /><h2 className="mt-4 text-3xl font-bold md:text-4xl">Make surplus visible.</h2><p className="mx-auto mt-3 max-w-xl text-zinc-400">One simple marketplace can turn an operational problem into a measurable environmental and social impact.</p><Link href="/map" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-zinc-950">See the demo <ArrowRight size={18} /></Link></div>
      </section>
      <Footer />
    </main>
  );
}
