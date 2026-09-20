export type Club = {
  id: string;
  name: string;
  league_id: string | null;
};

export type League = {
  id: string;
  name: string;
  country: string | null;
  tier: string | null;
};

export type IndexScore = {
  id: string;
  player_id: string;
  score: number;
  position_group: string;
  calculation_window: string;
  breakdown: Record<string, unknown> | null;
};

export type Player = {
  id: string;
  full_name: string;
  birth_date: string;
  nationality: string | null;
  position: string | null;
  height_cm: number | null;
  has_stat_data: boolean;
  current_club_id: string | null;
  // join'lerle gelen ek alanlar (Supabase select ile birlikte çekilir)
  clubs?: { name: string; leagues?: { name: string } | null } | null;
  index_scores?: IndexScore[];
};

export type ShortlistEntry = {
  id: string;
  player_id: string;
  note: string | null;
  added_at: string;
};
