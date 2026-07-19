-- calendar_events: schema for the Calendar & Appointment feature.
--
-- Not wired up yet — the app still runs entirely on localStorage
-- (see lib/local-repository.ts, which mirrors this async CRUD shape on
-- purpose). Apply this migration when a real Supabase project is ready
-- to be connected; the store layer above it won't need to change.

create extension if not exists "pgcrypto";

create type event_category as enum (
  'investigation',
  'submission',
  'appointment',
  'custody',
  'meeting'
);

create type reminder_offset as enum (
  '15m',
  '30m',
  '1h',
  '1d',
  '7d'
);

create table if not exists calendar_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  category event_category not null default 'appointment',
  start_time timestamptz not null,
  end_time timestamptz,
  all_day boolean not null default false,
  location text,
  reminder reminder_offset,
  case_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists calendar_events_owner_id_idx on calendar_events (owner_id);
create index if not exists calendar_events_start_time_idx on calendar_events (start_time);

alter table calendar_events enable row level security;

create policy "Owners can view their own events"
  on calendar_events for select
  using (auth.uid() = owner_id);

create policy "Owners can insert their own events"
  on calendar_events for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own events"
  on calendar_events for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete their own events"
  on calendar_events for delete
  using (auth.uid() = owner_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger calendar_events_set_updated_at
  before update on calendar_events
  for each row
  execute function set_updated_at();
