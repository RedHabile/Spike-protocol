create table if not exists public.player_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null check (jsonb_typeof(profile) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.player_profiles enable row level security;
grant usage on schema public to authenticated;
grant select, insert, update on public.player_profiles to authenticated;

create policy "Players can read their own profile"
  on public.player_profiles for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Players can create their own profile"
  on public.player_profiles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Players can update their own profile"
  on public.player_profiles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
