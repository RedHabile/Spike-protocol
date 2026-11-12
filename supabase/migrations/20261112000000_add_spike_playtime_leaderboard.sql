create table if not exists public.playtime_leaderboard (
  player_id uuid primary key,
  player_name text not null check (char_length(player_name) between 2 and 18),
  total_seconds bigint not null default 0 check (total_seconds >= 0),
  updated_at timestamptz not null default now()
);

alter table public.playtime_leaderboard enable row level security;
grant usage on schema public to anon, authenticated;
grant select on public.playtime_leaderboard to anon, authenticated;

drop policy if exists "Temps de jeu publics lisibles" on public.playtime_leaderboard;
create policy "Temps de jeu publics lisibles"
  on public.playtime_leaderboard for select
  to anon, authenticated
  using (true);

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
begin
  if p_seconds is null or p_seconds < 1 or p_seconds > 3600 then
    raise exception 'Durée invalide';
  end if;
  if clean_name is null or char_length(clean_name) < 2 or char_length(clean_name) > 18 then
    raise exception 'Pseudo invalide';
  end if;

  insert into public.playtime_leaderboard (player_id, player_name, total_seconds)
  values (p_player_id, clean_name, p_seconds)
  on conflict (player_id) do update
    set player_name = excluded.player_name,
        total_seconds = public.playtime_leaderboard.total_seconds + excluded.total_seconds,
        updated_at = now();
end;
$$;

revoke all on function public.submit_spike_playtime(uuid, text, integer) from public;
grant execute on function public.submit_spike_playtime(uuid, text, integer) to anon, authenticated;
