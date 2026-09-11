-- Profile data lives in public.users (one row per auth user), not in
-- auth.users.raw_user_meta_data. The account page reads/writes this table;
-- Supabase Auth keeps only credentials/session concerns.
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

drop policy if exists "Users can view their own profile" on public.users;
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.users;
create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create the profile row on sign-up, seeded from whatever the auth
-- provider gave us (Google supplies full_name + avatar_url).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, phone, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill rows for users who signed up before this table existed.
insert into public.users (id, email, full_name, phone, avatar_url)
select
  id,
  email,
  raw_user_meta_data ->> 'full_name',
  raw_user_meta_data ->> 'phone',
  raw_user_meta_data ->> 'avatar_url'
from auth.users
on conflict (id) do nothing;
