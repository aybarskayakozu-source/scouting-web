"use client";

import type { Player } from "@/lib/types";

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function scoreColor(score: number): string {
  if (score >= 85) return "text-emerald-400";
  if (score >= 70) return "text-lime-400";
  if (score >= 50) return "text-amber-400";
  return "text-slate-400";
}

export default function PlayerTable({
  players,
  shortlistIds,
  onToggleShortlist,
}: {
  players: Player[];
  shortlistIds: Set<string>;
  onToggleShortlist: (playerId: string) => void;
}) {
  if (players.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
        Bu filtrelere uyan oyuncu bulunamadı.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">Index</th>
            <th className="px-4 py-3 font-medium">Oyuncu</th>
            <th className="px-4 py-3 font-medium">Mevki</th>
            <th className="px-4 py-3 font-medium">Yaş</th>
            <th className="px-4 py-3 font-medium">Vatandaşlık</th>
            <th className="px-4 py-3 font-medium">Kulüp</th>
            <th className="px-4 py-3 font-medium">Lig</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {players.map((p) => {
            const scoreEntry = p.index_scores?.[0];
            const isShortlisted = shortlistIds.has(p.id);
            return (
              <tr key={p.id} className="bg-slate-950/40 hover:bg-slate-900/60">
                <td className={`px-4 py-3 font-mono text-base font-semibold ${scoreColor(scoreEntry?.score ?? 0)}`}>
                  {scoreEntry ? scoreEntry.score.toFixed(1) : "—"}
                </td>
                <td className="px-4 py-3 font-medium text-slate-100">{p.full_name}</td>
                <td className="px-4 py-3 text-slate-300">
                  {scoreEntry?.position_group ?? p.position ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-300">{calculateAge(p.birth_date)}</td>
                <td className="px-4 py-3 text-slate-300">{p.nationality ?? "—"}</td>
                <td className="px-4 py-3 text-slate-300">{p.clubs?.name ?? "—"}</td>
                <td className="px-4 py-3 text-slate-400">{p.clubs?.leagues?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onToggleShortlist(p.id)}
                    className={`rounded px-3 py-1 text-xs font-medium transition ${
                      isShortlisted
                        ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {isShortlisted ? "★ Listede" : "+ Shortlist"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
