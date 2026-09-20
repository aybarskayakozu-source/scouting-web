import { supabase } from "./supabaseClient";
import type { Player, League, ShortlistEntry } from "./types";

export type PlayerFilters = {
  minBirthYear?: number;
  maxBirthYear?: number;
  nationality?: string;
  leagueId?: string;
  positionGroup?: string;
  onlyWithIndex?: boolean;
  search?: string;
};

/**
 * Index puanı olan oyuncuları (has_stat_data + index_scores mevcut)
 * puana göre sıralı çeker. Filtrelere göre daraltılabilir.
 */
export async function fetchRankedPlayers(filters: PlayerFilters = {}, limit = 100) {
  let query = supabase
    .from("players")
    .select(
      `
      id, full_name, birth_date, nationality, position, height_cm, has_stat_data, current_club_id,
      clubs ( name, leagues ( name ) ),
      index_scores ( id, score, position_group, calculation_window, breakdown )
      `
    )
    .not("index_scores", "is", null)
    .limit(limit);

  if (filters.minBirthYear) {
    query = query.gte("birth_date", `${filters.minBirthYear}-01-01`);
  }
  if (filters.maxBirthYear) {
    query = query.lte("birth_date", `${filters.maxBirthYear}-12-31`);
  }
  if (filters.nationality) {
    query = query.eq("nationality", filters.nationality);
  }
  if (filters.search) {
    query = query.ilike("full_name", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  let players = (data ?? []) as unknown as Player[];

  // index_scores bir dizi olarak geliyor (bire çok ilişki gibi göründüğü
  // için) - her oyuncunun tek skoru olduğundan ilkini kullanıyoruz.
  players = players.filter((p) => p.index_scores && p.index_scores.length > 0);

  if (filters.positionGroup) {
    players = players.filter(
      (p) => p.index_scores?.[0]?.position_group === filters.positionGroup
    );
  }

  // Puana göre büyükten küçüğe sırala
  players.sort((a, b) => (b.index_scores?.[0]?.score ?? 0) - (a.index_scores?.[0]?.score ?? 0));

  return players;
}

/**
 * Index/istatistik verisi olmayan ("sınırlı veri") oyuncuları çeker.
 * Genç oyuncu radarı sekmesi için.
 */
export async function fetchLimitedDataPlayers(filters: PlayerFilters = {}, limit = 200) {
  let query = supabase
    .from("players")
    .select(
      `
      id, full_name, birth_date, nationality, position, height_cm, has_stat_data, current_club_id,
      clubs ( name, leagues ( name ) ),
      index_scores ( id )
      `
    )
    .limit(limit);

  if (filters.minBirthYear) {
    query = query.gte("birth_date", `${filters.minBirthYear}-01-01`);
  }
  if (filters.search) {
    query = query.ilike("full_name", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  const players = (data ?? []) as unknown as Player[];
  // index_scores'u boş olanlar = sınırlı veri grubu
  return players.filter((p) => !p.index_scores || p.index_scores.length === 0);
}

export async function fetchDistinctNationalities(): Promise<string[]> {
  const { data, error } = await supabase
    .from("players")
    .select("nationality")
    .not("nationality", "is", null);
  if (error) throw error;
  const set = new Set((data ?? []).map((r) => r.nationality as string));
  return Array.from(set).sort();
}

export async function fetchLeagues(): Promise<League[]> {
  const { data, error } = await supabase.from("leagues").select("*").order("name");
  if (error) throw error;
  return data as League[];
}

export async function fetchShortlist(): Promise<ShortlistEntry[]> {
  const { data, error } = await supabase
    .from("shortlist")
    .select("*")
    .order("added_at", { ascending: false });
  if (error) throw error;
  return data as ShortlistEntry[];
}

export async function addToShortlist(playerId: string, note?: string) {
  const { error } = await supabase.from("shortlist").insert({
    player_id: playerId,
    note: note ?? null,
  });
  if (error) throw error;
}

export async function removeFromShortlist(playerId: string) {
  const { error } = await supabase.from("shortlist").delete().eq("player_id", playerId);
  if (error) throw error;
}

export async function fetchPlayersByIds(ids: string[]): Promise<Player[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("players")
    .select(
      `
      id, full_name, birth_date, nationality, position, height_cm, has_stat_data, current_club_id,
      clubs ( name, leagues ( name ) ),
      index_scores ( id, score, position_group, calculation_window, breakdown )
      `
    )
    .in("id", ids);
  if (error) throw error;
  return (data ?? []) as unknown as Player[];
}
