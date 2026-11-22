create table if not exists public.spike_update_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 3 and 100),
  content text not null check (char_length(btrim(content)) between 10 and 4000),
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists spike_update_notes_latest_idx
  on public.spike_update_notes (created_at desc)
  where published = true;
alter table public.spike_update_notes enable row level security;
revoke all on table public.spike_update_notes from public, anon, authenticated;
grant select on table public.spike_update_notes to anon, authenticated;
drop policy if exists "Anyone can read published Spike update notes" on public.spike_update_notes;
create policy "Anyone can read published Spike update notes"
  on public.spike_update_notes for select to anon, authenticated
  using (published = true);