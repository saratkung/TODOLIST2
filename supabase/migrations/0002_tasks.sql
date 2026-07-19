-- tasks: schema for the Task Management feature.
--
-- Same status as 0001_calendar_events.sql — not wired up yet. The app
-- still runs entirely on localStorage (see lib/local-repository.ts).
-- Apply when a real Supabase project is ready; the store layer above
-- it won't need to change.
--
-- Note: the app's TS model stores a single `dueDate` timestamp and a
-- `completed` boolean rather than separate due_date/due_time/status
-- columns. This schema keeps them separate (closer to a normal
-- relational shape); the local-repository boundary is where the two
-- representations would be translated when this is wired up.

create type task_priority as enum (
  'low',
  'medium',
  'high',
  'urgent'
);

create type task_status as enum (
  'pending',
  'completed'
);

create type task_recurrence as enum (
  'none',
  'daily',
  'weekly',
  'monthly'
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  due_time time,
  priority task_priority not null default 'medium',
  status task_status not null default 'pending',
  tags text[] not null default '{}',
  reminder reminder_offset,
  recurrence task_recurrence not null default 'none',
  case_id uuid,
  calendar_event_id uuid references calendar_events (id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_owner_id_idx on tasks (owner_id);
create index if not exists tasks_due_date_idx on tasks (due_date);
create index if not exists tasks_status_idx on tasks (status);
create index if not exists tasks_case_id_idx on tasks (case_id);

alter table tasks enable row level security;

create policy "Owners can view their own tasks"
  on tasks for select
  using (auth.uid() = owner_id);

create policy "Owners can insert their own tasks"
  on tasks for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own tasks"
  on tasks for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete their own tasks"
  on tasks for delete
  using (auth.uid() = owner_id);

create trigger tasks_set_updated_at
  before update on tasks
  for each row
  execute function set_updated_at();
