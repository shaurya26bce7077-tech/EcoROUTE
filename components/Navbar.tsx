import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400 text-lg text-zinc-950">♻</span>
          <span>Eco<span className="text-emerald-400">Route</span></span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <Link href="/map" className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white">Explore</Link>
          <Link href="/my-claims" className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white">My claims</Link>
          <Link href="/dashboard" className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white">Dashboard</Link>
          <Link href="/dashboard/listings/new" className="ml-2 rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-zinc-950 hover:bg-emerald-300">Post surplus</Link>
        </div>
      </nav>
    </header>
  );
}
