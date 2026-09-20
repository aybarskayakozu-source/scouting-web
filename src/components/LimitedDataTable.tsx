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

export default function LimitedDataTable({ players }: { players: Player[] }) {
  if (players.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
        Sınırlı veri grubunda oyuncu bulunamadı.
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-slate-400">
        Bu oyuncular bu sezon henüz maça çıkmamış veya mevkisi net değil, bu yüzden
        index puanı hesaplanamıyor. Genç oyuncu takibi için buradalar.
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Oyuncu</th>
              <th className="px-4 py-3 font-medium">Mevki</th>
              <th className="px-4 py-3 font-medium">Yaş</th>
              <th className="px-4 py-3 font-medium">Vatandaşlık</th>
              <th className="px-4 py-3 font-medium">Kulüp</th>
              <th className="px-4 py-3 font-medium">Lig</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {players.map((p) => (
              <tr key={p.id} className="bg-slate-950/40 hover:bg-slate-900/60">
                <td className="px-4 py-3 font-medium text-slate-100">{p.full_name}</td>
                <td className="px-4 py-3 text-slate-300">{p.position ?? "—"}</td>
                <td className="px-4 py-3 text-slate-300">{calculateAge(p.birth_date)}</td>
                <td className="px-4 py-3 text-slate-300">{p.nationality ?? "—"}</td>
                <td className="px-4 py-3 text-slate-300">{p.clubs?.name ?? "—"}</td>
                <td className="px-4 py-3 text-slate-400">{p.clubs?.leagues?.name ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
