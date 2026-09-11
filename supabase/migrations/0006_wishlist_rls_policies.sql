-- Wishlist now has a real auth identity to scope to (Supabase Auth), so we
-- can safely open up per-user RLS policies. user_id stays `text` (matches
-- the existing column from migration 0003); auth.uid() is cast to text for
-- the comparison since it returns uuid.
create policy "Users can view their own wishlist items"
  on public.wishlist_items for select
  using (auth.uid()::text = user_id);

create policy "Users can insert their own wishlist items"
  on public.wishlist_items for insert
  with check (auth.uid()::text = user_id);

create policy "Users can delete their own wishlist items"
  on public.wishlist_items for delete
  using (auth.uid()::text = user_id);
