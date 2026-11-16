create table if not exists public.spike_player_names (
  user_id uuid primary key references auth.users(id) on delete cascade,
  player_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists spike_player_names_lower_unique
  on public.spike_player_names (lower(player_name));
alter table public.spike_player_names enable row level security;
drop policy if exists "Players can read own Spike Protocol name" on public.spike_player_names;
create policy "Players can read own Spike Protocol name"
  on public.spike_player_names for select to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.get_my_spike_name()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare existing_name text;
begin
  if auth.uid() is null then raise exception 'Connexion requise.'; end if;
  select player_name into existing_name
    from public.spike_player_names where user_id = auth.uid();
  if existing_name is not null then return existing_name; end if;

  select player_name into existing_name
    from public.leaderboard where player_id = auth.uid()
  union all
  select player_name
    from public.playtime_leaderboard where player_id = auth.uid()
  limit 1;

  if existing_name is not null then
    perform pg_advisory_xact_lock(hashtextextended(lower(existing_name), 0));
    if not exists (select 1 from public.spike_player_names
                   where lower(player_name) = lower(existing_name) and user_id <> auth.uid()) then
      insert into public.spike_player_names(user_id, player_name)
      values (auth.uid(), existing_name)
      on conflict (user_id) do nothing;
      return existing_name;
    end if;
  end if;
  return null;
end;
$$;

create or replace function public.claim_spike_name(p_player_name text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare clean_name text := btrim(regexp_replace(p_player_name, '\s+', ' ', 'g'));
begin
  if auth.uid() is null then raise exception 'Connecte-toi pour choisir ton pseudo.'; end if;
  if clean_name is null or char_length(clean_name) < 2 or char_length(clean_name) > 18 then
    raise exception 'Le pseudo doit contenir entre 2 et 18 caractères.';
  end if;
  if clean_name !~ '^[[:alnum:] _.-]+$' then
    raise exception 'Utilise uniquement des lettres, chiffres, espaces, points, tirets ou underscores.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(lower(clean_name), 0));
  if exists (select 1 from public.spike_player_names
             where lower(player_name) = lower(clean_name) and user_id <> auth.uid())
     or exists (select 1 from public.leaderboard
                where lower(player_name) = lower(clean_name) and player_id <> auth.uid())
     or exists (select 1 from public.playtime_leaderboard
                where lower(player_name) = lower(clean_name) and player_id <> auth.uid()) then
    raise exception 'Ce pseudo est déjà utilisé. Choisis-en un autre.';
  end if;

  insert into public.spike_player_names(user_id, player_name, updated_at)
  values (auth.uid(), clean_name, now())
  on conflict (user_id) do update
    set player_name = excluded.player_name, updated_at = now();
  return clean_name;
end;
$$;

revoke all on function public.get_my_spike_name() from public, anon;
revoke all on function public.claim_spike_name(text) from public, anon;
grant execute on function public.get_my_spike_name() to authenticated;
grant execute on function public.claim_spike_name(text) to authenticated;
