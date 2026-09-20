"use client";

import { useEffect, useMemo, useState } from "react";
import type { Player } from "@/lib/types";
import type { PlayerFilters } from "@/lib/queries";
import {
  fetchRankedPlayers,
  fetchLimitedDataPlayers,
  fetchDistinctNationalities,
  fetchShortlist,
  fetchPlayersByIds,
  addToShortlist,
  removeFromShortlist,
} from "@/lib/queries";
import FilterBar from "@/components/FilterBar";
import PlayerTable from "@/components/PlayerTable";
import LimitedDataTable from "@/components/LimitedDataTable";
import Tabs, { type TabKey } from "@/components/Tabs";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("ranked");
  const [filters, setFilters] = useState<PlayerFilters>({ minBirthYear: 2004 });
  const [rankedPlayers, setRankedPlayers] = useState<Player[]>([]);
  const [limitedPlayers, setLimitedPlayers] = useState<Player[]>([]);
  const [shortlistIds, setShortlistIds] = useState<Set<string>>(new Set());
  const [shortlistPlayers, setShortlistPlayers] = useState<Player[]>([]);
  const [nationalities, setNationalities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vatandaşlık listesini bir kere çek
  useEffect(() => {
    fetchDistinctNationalities().then(setNationalities).catch(() => {});
  }, []);

  // Shortlist'i çek
  async function refreshShortlist() {
    const entries = await fetchShortlist();
    const ids = new Set(entries.map((e) => e.player_id));
    setShortlistIds(ids);
    const players = await fetchPlayersByIds(Array.from(ids));
    setShortlistPlayers(players);
  }

  useEffect(() => {
    refreshShortlist().catch(() => {});
  }, []);

  // Aktif sekme ve filtrelere göre veri çek
  useEffect(() => {
    setLoading(true);
    setError(null);

    const task =
      activeTab === "ranked"
        ? fetchRankedPlayers(filters).then(setRankedPlayers)
        : activeTab === "limited"
        ? fetchLimitedDataPlayers(filters).then(setLimitedPlayers)
        : Promise.resolve();

    task
      .catch((e) => setError(e.message ?? "Bilinmeyen hata"))
      .finally(() => setLoading(false));
  }, [activeTab, filters]);

  async function handleToggleShortlist(playerId: string) {
    if (shortlistIds.has(playerId)) {
      await removeFromShortlist(playerId);
    } else {
      await addToShortlist(playerId);
    }
    await refreshShortlist();
  }

  const displayedPlayers = useMemo(() => {
    if (activeTab === "shortlist") return shortlistPlayers;
    return rankedPlayers;
  }, [activeTab, shortlistPlayers, rankedPlayers]);

  return (
    <div>
      <Tabs active={activeTab} onChange={setActiveTab} />

      {(activeTab === "ranked" || activeTab === "limited") && (
        <FilterBar filters={filters} onChange={setFilters} nationalities={nationalities} />
      )}

      {error && (
        <div className="mb-4 rounded border border-red-800 bg-red-950/50 p-3 text-sm text-red-300">
          Hata: {error}
        </div>
      )}

      {loading && activeTab !== "shortlist" ? (
        <div className="p-8 text-center text-slate-400">Yükleniyor...</div>
      ) : activeTab === "limited" ? (
        <LimitedDataTable players={limitedPlayers} />
      ) : (
        <PlayerTable
          players={displayedPlayers}
          shortlistIds={shortlistIds}
          onToggleShortlist={handleToggleShortlist}
        />
      )}
    </div>
  );
}
