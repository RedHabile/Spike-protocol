-- Garantit des pseudos uniques, sans suffixe automatique.
-- Les noms sont comparés sans tenir compte des majuscules/minuscules.
-- Le même compte peut conserver son pseudo dans les deux classements.

create or replace function public.submit_spike_score(
  p_player_id uuid,
  p_player_name text,
  p_score integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_name text := btrim(regexp_replace(p_player_name, '\\s+', ' ', 'g'));
  name_taken boolean;
begin
  if p_score is null or p_score < 0 or p_score > 1000000 then
    raise exception 'Score invalide';
  end if;
  if clean_name is null or char_length(clean_name) < 2 or char_length(clean_name) > 18 then
    raise exception 'Le pseudo doit contenir entre 2 et 18 caractères.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(lower(clean_name), 0));
  select exists (
    select 1 from public.leaderboard
    where lower(player_name) = lower(clean_name) and player_id <> p_player_id
    union all
    select 1 from public.playtime_leaderboard
    where lower(player_name) = lower(clean_name) and player_id <> p_player_id
  ) into name_taken;
  if name_taken then
    raise exception 'Ce pseudo est déjà utilisé. Choisis-en un autre.';
  end if;

  insert into public.leaderboard (player_id, player_name, best_score)
  values (p_player_id, clean_name, p_score)
  on conflict (player_id) do update
    set player_name = excluded.player_name,
        best_score = greatest(public.leaderboard.best_score, excluded.best_score),
        updated_at = now();
end;
$$;

create or replace function public.submit_spike_playtime(
  p_player_id uuid,
  p_player_name text,
  p_seconds integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_name text := btrim(regexp_replace(p_player_name, '\\s+', ' ', 'g'));
  name_taken boolean;
begin
  if p_seconds is null or p_seconds < 1 or p_seconds > 3600 then
    raise exception 'Durée invalide';
  end if;
  if clean_name is null or char_length(clean_name) < 2 or char_length(clean_name) > 18 then
    raise exception 'Le pseudo doit contenir entre 2 et 18 caractères.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(lower(clean_name), 0));
  select exists (
    select 1 from public.leaderboard
    where lower(player_name) = lower(clean_name) and player_id <> p_player_id
    union all
    select 1 from public.playtime_leaderboard
    where lower(player_name) = lower(clean_name) and player_id <> p_player_id
  ) into name_taken;
  if name_taken then
    raise exception 'Ce pseudo est déjà utilisé. Choisis-en un autre.';
  end if;

  insert into public.playtime_leaderboard (player_id, player_name, total_seconds)
  values (p_player_id, clean_name, p_seconds)
  on conflict (player_id) do update
    set player_name = excluded.player_name,
        total_seconds = public.playtime_leaderboard.total_seconds + excluded.total_seconds,
        updated_at = now();
end;
$$;

revoke all on function public.submit_spike_score(uuid, text, integer) from public;
revoke all on function public.submit_spike_playtime(uuid, text, integer) from public;
grant execute on function public.submit_spike_score(uuid, text, integer) to anon, authenticated;
grant execute on function public.submit_spike_playtime(uuid, text, integer) to anon, authenticated;
