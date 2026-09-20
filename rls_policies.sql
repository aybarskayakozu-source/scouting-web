-- ============================================================
-- RLS OKUMA/YAZMA POLİTİKALARI
-- ============================================================
-- Bu, Supabase SQL Editor'de bir kez çalıştırılacak. RLS açık
-- olduğu için şu an anon (web sitesi) anahtarıyla hiçbir tabloya
-- erişilemiyor - bu politikalar bunu açar.
--
-- Bireysel kullanım projesi olduğu için basit tutuyoruz:
--   - players, clubs, leagues, index_scores, youth_watchlist:
--     herkese (anon) SADECE OKUMA izni (senin sitenin veri
--     göstermesi için yeterli)
--   - shortlist: hem okuma hem yazma (ekleme/silme) izni, çünkü
--     bu senin kişisel takip listen ve siteden ekleyip
--     çıkaracaksın; login sistemi olmadığı için bunu herkese
--     açık bırakıyoruz - platform sadece senin bileceğin bir
--     Vercel linkinde olacağı için pratikte risk düşük

-- Okuma politikaları
create policy "public_read_players" on players
  for select using (true);

create policy "public_read_clubs" on clubs
  for select using (true);

create policy "public_read_leagues" on leagues
  for select using (true);

create policy "public_read_index_scores" on index_scores
  for select using (true);

create policy "public_read_youth_watchlist" on youth_watchlist
  for select using (true);

-- Shortlist: okuma + yazma + silme
create policy "public_read_shortlist" on shortlist
  for select using (true);

create policy "public_insert_shortlist" on shortlist
  for insert with check (true);

create policy "public_delete_shortlist" on shortlist
  for delete using (true);

create policy "public_update_shortlist" on shortlist
  for update using (true) with check (true);
