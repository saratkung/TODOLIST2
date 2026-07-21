-- google_calendar_connections + calendar_events additions: schema for
-- the Google Calendar two-way sync feature.
--
-- Documentation only, not applied yet — there is no real Supabase
-- project connected to this app (same status as every migration before
-- it). A real Google OAuth client IS configured now (see
-- lib/google-oauth.ts, app/api/auth/google/*), but token storage
-- currently uses a pragmatic single-user substitute: an httpOnly,
-- AES-256-GCM-encrypted cookie (lib/google-session.ts,
-- lib/token-crypto.ts) instead of this table + Vault. Apply this
-- migration and switch lib/google-session.ts over to it once a real
-- Supabase project with multi-user auth exists.
--
-- SECURITY: access_token and refresh_token must never be stored as
-- plaintext columns. This table stores only a reference to a secret —
-- the tokens themselves belong in Supabase Vault
-- (https://supabase.com/docs/guides/database/vault), which encrypts
-- secrets at rest and exposes them only via `vault.decrypted_secrets`
-- under RLS/service-role access. Store each token pair as a Vault
-- secret (e.g. named `google_calendar_tokens_{connection_id}`) and keep
-- only the secret id here.

create extension if not exists "pgcrypto";

create type google_sync_status as enum (
  'synced',
  'syncing',
  'error',
  'not_synced'
);

create table if not exists google_calendar_connections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  google_email text not null,
  -- id of the Vault secret holding { access_token, refresh_token, expiry } — never plaintext tokens.
  token_secret_id uuid not null references vault.secrets (id) on delete cascade,
  sync_token text,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id)
);

create index if not exists google_calendar_connections_owner_id_idx
  on google_calendar_connections (owner_id);

alter table google_calendar_connections enable row level security;

create policy "Owners can view their own connection"
  on google_calendar_connections for select
  using (auth.uid() = owner_id);

create policy "Owners can insert their own connection"
  on google_calendar_connections for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own connection"
  on google_calendar_connections for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete their own connection"
  on google_calendar_connections for delete
  using (auth.uid() = owner_id);

create trigger google_calendar_connections_set_updated_at
  before update on google_calendar_connections
  for each row
  execute function set_updated_at();

-- calendar_events additions: link each local event to its Google counterpart.
alter table calendar_events
  add column if not exists google_event_id text,
  add column if not exists sync_status google_sync_status not null default 'not_synced',
  add column if not exists last_synced_at timestamptz;

create index if not exists calendar_events_google_event_id_idx
  on calendar_events (google_event_id)
  where google_event_id is not null;
