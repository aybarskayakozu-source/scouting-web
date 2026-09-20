"use client";

import type { PlayerFilters } from "@/lib/queries";

const POSITION_GROUPS = ["GK", "CB", "FB", "CM", "CAM", "W", "ST"];

export default function FilterBar({
  filters,
  onChange,
  nationalities,
}: {
  filters: PlayerFilters;
  onChange: (next: PlayerFilters) => void;
  nationalities: string[];
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">İsim ara</label>
        <input
          type="text"
          value={filters.search ?? ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Oyuncu adı..."
          className="rounded border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-100 outline-none focus:border-slate-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Doğum yılı (min)</label>
        <input
          type="number"
          value={filters.minBirthYear ?? 2004}
          onChange={(e) => onChange({ ...filters, minBirthYear: Number(e.target.value) })}
          className="w-24 rounded border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-100 outline-none focus:border-slate-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Doğum yılı (max)</label>
        <input
          type="number"
          value={filters.maxBirthYear ?? ""}
          onChange={(e) =>
            onChange({ ...filters, maxBirthYear: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="Hepsi"
          className="w-24 rounded border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-100 outline-none focus:border-slate-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Mevki grubu</label>
        <select
          value={filters.positionGroup ?? ""}
          onChange={(e) => onChange({ ...filters, positionGroup: e.target.value || undefined })}
          className="rounded border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-100 outline-none focus:border-slate-500"
        >
          <option value="">Hepsi</option>
          {POSITION_GROUPS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Vatandaşlık</label>
        <select
          value={filters.nationality ?? ""}
          onChange={(e) => onChange({ ...filters, nationality: e.target.value || undefined })}
          className="rounded border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-100 outline-none focus:border-slate-500"
        >
          <option value="">Hepsi</option>
          {nationalities.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
