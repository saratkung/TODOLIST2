-- users: profile fields for the Profile page.
--
-- Same status as 0001-0004 — not wired up yet. The app currently has no
-- auth system at all (single implicit "local-user" owner, see
-- lib/local-repository.ts / LOCAL_OWNER_ID), so this table is written
-- against Supabase Auth's `auth.users` the way the other tables'
-- `owner_id` columns already assume — apply this alongside actually
-- wiring up Supabase Auth, not before.
--
-- Avatar uploads today are simulated client-side: the image is cropped
-- to a circle, resized, and compressed to a JPEG data URL entirely in
-- the browser (see features/profile/components/avatar-crop-dialog.tsx)
-- and stored inline in this app's local profile store. There is no
-- Storage bucket to create via SQL — once Supabase is connected, create
-- a public "avatars" bucket (via dashboard or `supabase storage`
-- CLI) and upload to the path convention `avatars/{user_id}/profile.jpg`,
-- then store the resulting public URL in `avatar_url` below instead of
-- a data URL.

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  email text not null,
  phone text,
  department text,
  position text,
  rank text,
  avatar_url text,
  notifications_enabled boolean not null default true,
  member_since timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create trigger users_set_updated_at
  before update on public.users
  for each row
  execute function set_updated_at();

-- Auto-create a profile row when someone signs up, mirroring the common
-- Supabase Auth pattern (trigger on auth.users insert).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Storage policy reference (apply once the "avatars" bucket exists):
--
-- create policy "Avatar images are publicly accessible"
--   on storage.objects for select
--   using (bucket_id = 'avatars');
--
-- create policy "Users can upload their own avatar"
--   on storage.objects for insert
--   with check (
--     bucket_id = 'avatars'
--     and (storage.foldername(name))[1] = auth.uid()::text
--   );
