-- Lets a signed-in user create their own public.users row through their
-- session (RLS) if the sign-up trigger didn't produce one, so the account
-- page doesn't need the service-role key just to render.
drop policy if exists "Users can insert their own profile" on public.users;
create policy "Users can insert their own profile"
  on public.users for insert
  with check (auth.uid() = id);
