-- case_checklists, case_timeline, case_notes, case_attachments — the
-- remaining Case Workspace tables (Phase 5), all linked to cases via case_id.
--
-- Same status as 0001-0003 — not wired up yet, app still runs on
-- localStorage. Apply when a real Supabase project is ready.
--
-- Note: `url` on case_attachments is a browser blob: URL today (see
-- lib/local-repository.ts + case-attachments-panel.tsx), which only
-- resolves within the tab that created it. Wiring this up for real
-- means uploading to Supabase Storage first and storing that object's
-- path/public URL here instead.

create type attachment_kind as enum (
  'pdf',
  'word',
  'excel',
  'image',
  'audio',
  'video',
  'link',
  'other'
);

create table if not exists case_checklists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  case_id uuid not null references cases (id) on delete cascade,
  parent_id uuid references case_checklists (id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists case_timeline (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  case_id uuid not null references cases (id) on delete cascade,
  title text not null,
  description text,
  occurred_at timestamptz not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists case_notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  case_id uuid not null references cases (id) on delete cascade,
  content text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists case_attachments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  case_id uuid not null references cases (id) on delete cascade,
  name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  url text not null,
  kind attachment_kind not null default 'other',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists case_checklists_case_id_idx on case_checklists (case_id);
create index if not exists case_timeline_case_id_idx on case_timeline (case_id);
create index if not exists case_notes_case_id_idx on case_notes (case_id);
create index if not exists case_notes_pinned_idx on case_notes (case_id, pinned);
create index if not exists case_attachments_case_id_idx on case_attachments (case_id);

alter table case_checklists enable row level security;
alter table case_timeline enable row level security;
alter table case_notes enable row level security;
alter table case_attachments enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['case_checklists', 'case_timeline', 'case_notes', 'case_attachments']
  loop
    execute format(
      'create policy "Owners can view their own %1$s" on %1$s for select using (auth.uid() = owner_id);',
      t
    );
    execute format(
      'create policy "Owners can insert their own %1$s" on %1$s for insert with check (auth.uid() = owner_id);',
      t
    );
    execute format(
      'create policy "Owners can update their own %1$s" on %1$s for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);',
      t
    );
    execute format(
      'create policy "Owners can delete their own %1$s" on %1$s for delete using (auth.uid() = owner_id);',
      t
    );
    execute format(
      'create trigger %1$s_set_updated_at before update on %1$s for each row execute function set_updated_at();',
      t
    );
  end loop;
end $$;
