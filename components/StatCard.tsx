import type { ReactNode } from "react";

export default function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400">{icon}</span>
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
