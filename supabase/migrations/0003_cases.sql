-- cases: schema for the Case Management feature — the hub that tasks
-- and calendar_events already carry a nullable case_id toward.
--
-- Same status as 0001/0002 — not wired up yet, app still runs on
-- localStorage. Apply when a real Supabase project is ready.
--
-- Note: `progress` is derived client-side today from checklist
-- completion (see utils/case.ts caseProgress), not stored. Kept here
-- as a denormalized cache column for cheap sorting/filtering once a
-- real backend is wired up — recompute it whenever checklist_items
-- changes rather than trusting it as a source of truth.

create type case_status as enum (
  'received',
  'investigating',
  'pending_result',
  'submitted',
  'closed'
);

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  case_number text not null,
  title text not null,
  category text not null,
  description text,
  complainant text,
  victim text,
  suspect text,
  investigator text not null,
  status case_status not null default 'received',
  priority task_priority not null default 'medium',
  progress smallint not null default 0 check (progress between 0 and 100),
  deadline date,
  custody_deadline date,
  submission_deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, case_number)
);

create index if not exists cases_owner_id_idx on cases (owner_id);
create index if not exists cases_status_idx on cases (status);
create index if not exists cases_category_idx on cases (category);

alter table tasks
  add constraint tasks_case_id_fkey
  foreign key (case_id) references cases (id) on delete set null;

alter table calendar_events
  add constraint calendar_events_case_id_fkey
  foreign key (case_id) references cases (id) on delete set null;

alter table cases enable row level security;

create policy "Owners can view their own cases"
  on cases for select
  using (auth.uid() = owner_id);

create policy "Owners can insert their own cases"
  on cases for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own cases"
  on cases for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete their own cases"
  on cases for delete
  using (auth.uid() = owner_id);

create trigger cases_set_updated_at
  before update on cases
  for each row
  execute function set_updated_at();
