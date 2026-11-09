-- Spike Protocol: classement mondial
-- À exécuter une seule fois dans Supabase > SQL Editor.

create table if not exists public.leaderboard (
  player_id uuid primary key,
  player_name text not null check (char_length(player_name) between 2 and 18),
  best_score integer not null check (best_score >= 0 and best_score <= 1000000),
  updated_at timestamptz not null default now()
);

alter table public.leaderboard enable row level security;

drop policy if exists "Scores publics lisibles" on public.leaderboard;
create policy "Scores publics lisibles"
  on public.leaderboard for select
  to anon, authenticated
  using (true);

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
  clean_name text := btrim(regexp_replace(p_player_name, '\s+', ' ', 'g'));
begin
  if p_score is null or p_score < 0 or p_score > 1000000 then
    raise exception 'Score invalide';
  end if;
  if clean_name is null or char_length(clean_name) < 2 or char_length(clean_name) > 18 then
    raise exception 'Pseudo invalide';
  end if;

  insert into public.leaderboard (player_id, player_name, best_score)
  values (p_player_id, clean_name, p_score)
  on conflict (player_id) do update
    set player_name = excluded.player_name,
        best_score = greatest(public.leaderboard.best_score, excluded.best_score),
        updated_at = now();
end;
$$;

grant usage on schema public to anon, authenticated;
grant select on public.leaderboard to anon, authenticated;
grant execute on function public.submit_spike_score(uuid, text, integer) to anon, authenticated;
