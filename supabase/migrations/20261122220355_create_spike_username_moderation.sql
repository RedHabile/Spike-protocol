create table if not exists public.spike_username_warnings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (char_length(reason) between 4 and 300),
  previous_name text,
  new_name text,
  status text not null default 'pending' check (status in ('pending','resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists spike_username_warnings_user_pending_idx
  on public.spike_username_warnings (user_id, created_at desc)
  where status = 'pending';

alter table public.spike_username_warnings enable row level security;
revoke all on table public.spike_username_warnings from public, anon, authenticated;
grant select on public.spike_username_warnings to authenticated;

drop policy if exists "Players can read their own username warnings" on public.spike_username_warnings;
create policy "Players can read their own username warnings"
  on public.spike_username_warnings
  for select to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.get_my_spike_warning()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $function$
  select jsonb_build_object(
    'reason', w.reason,
    'previous_name', w.previous_name,
    'created_at', w.created_at
  )
  from public.spike_username_warnings w
  where w.user_id = (select auth.uid())
    and w.status = 'pending'
  order by w.created_at desc
  limit 1;
$function$;

revoke all on function public.get_my_spike_warning() from public, anon;
grant execute on function public.get_my_spike_warning() to authenticated;

create or replace function public.claim_spike_name(p_player_name text)
returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
  clean_name text := btrim(regexp_replace(p_player_name, '\s+', ' ', 'g'));
  required_old_name text;
begin
  if auth.uid() is null then
    raise exception 'Connecte-toi pour choisir ton pseudo.';
  end if;
  if clean_name is null or char_length(clean_name) < 2 or char_length(clean_name) > 18 then
    raise exception 'Le pseudo doit contenir entre 2 et 18 caractères.';
  end if;
  if clean_name !~ '^[[:alnum:] _.-]+$' then
    raise exception 'Utilise uniquement des lettres, chiffres, espaces, points, tirets ou underscores.';
  end if;

  select w.previous_name into required_old_name
  from public.spike_username_warnings w
  where w.user_id = auth.uid() and w.status = 'pending'
  order by w.created_at desc
  limit 1;

  if required_old_name is not null and lower(clean_name) = lower(required_old_name) then
    raise exception 'Tu dois choisir un nouveau pseudo différent de ton ancien pseudo.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(lower(clean_name), 0));
  if exists (
    select 1 from public.spike_player_names
    where lower(player_name) = lower(clean_name) and user_id <> auth.uid()
  ) or exists (
    select 1 from public.leaderboard
    where lower(player_name) = lower(clean_name) and player_id <> auth.uid()
  ) or exists (
    select 1 from public.playtime_leaderboard
    where lower(player_name) = lower(clean_name) and player_id <> auth.uid()
  ) then
    raise exception 'Ce pseudo est déjà utilisé. Choisis-en un autre.';
  end if;

  insert into public.spike_player_names(user_id, player_name, updated_at)
  values (auth.uid(), clean_name, now())
  on conflict (user_id) do update
    set player_name = excluded.player_name, updated_at = now();

  update public.leaderboard
    set player_name = clean_name, updated_at = now()
    where player_id = auth.uid();

  update public.playtime_leaderboard
    set player_name = clean_name, updated_at = now()
    where player_id = auth.uid();

  update public.spike_username_warnings
    set status = 'resolved', new_name = clean_name, resolved_at = now()
    where user_id = auth.uid() and status = 'pending';

  return clean_name;
end;
$function$;

create or replace function public.submit_spike_score(p_player_id uuid, p_player_name text, p_score integer)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  clean_name text := btrim(regexp_replace(p_player_name, '\s+', ' ', 'g'));
  name_taken boolean;
begin
  if auth.uid() is null or auth.uid() <> p_player_id then
    raise exception 'Connexion requise pour enregistrer un record.';
  end if;
  if exists (
    select 1 from public.spike_username_warnings
    where user_id = auth.uid() and status = 'pending'
  ) then
    raise exception 'Ton compte doit modifier son pseudo avant de jouer.';
  end if;
  if p_score is null or p_score < 0 or p_score > 1000000 then
    raise exception 'Score invalide';
  end if;
  if clean_name is null or char_length(clean_name) < 2 or char_length(clean_name) > 18 then
    raise exception 'Le pseudo doit contenir entre 2 et 18 caractères.';
  end if;
  if not exists (
    select 1 from public.spike_player_names
    where user_id = auth.uid() and lower(player_name) = lower(clean_name)
  ) then
    raise exception 'Choisis ton pseudo de compte avant de publier un record.';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(lower(clean_name), 0));
  select exists (
    select 1 from public.leaderboard
    where lower(player_name) = lower(clean_name) and player_id <> p_player_id
    union all
    select 1 from public.playtime_leaderboard
    where lower(player_name) = lower(clean_name) and player_id <> p_player_id
    union all
    select 1 from public.spike_player_names
    where lower(player_name) = lower(clean_name) and user_id <> p_player_id
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
$function$;

create or replace function public.submit_spike_playtime(p_player_id uuid, p_player_name text, p_seconds integer)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  clean_name text := btrim(regexp_replace(p_player_name, '\s+', ' ', 'g'));
  name_taken boolean;
begin
  if auth.uid() is null or auth.uid() <> p_player_id then
    raise exception 'Connexion requise pour enregistrer le temps de jeu.';
  end if;
  if exists (
    select 1 from public.spike_username_warnings
    where user_id = auth.uid() and status = 'pending'
  ) then
    raise exception 'Ton compte doit modifier son pseudo avant de jouer.';
  end if;
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
    union all
    select 1 from public.spike_player_names
    where lower(player_name) = lower(clean_name) and user_id <> p_player_id
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
$function$;
