create table if not exists public.user_stickers (
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  quantity integer not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, code)
);

alter table public.user_stickers enable row level security;

drop policy if exists "Users can read their own stickers" on public.user_stickers;
create policy "Users can read their own stickers"
on public.user_stickers
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own stickers" on public.user_stickers;
create policy "Users can insert their own stickers"
on public.user_stickers
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own stickers" on public.user_stickers;
create policy "Users can update their own stickers"
on public.user_stickers
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own stickers" on public.user_stickers;
create policy "Users can delete their own stickers"
on public.user_stickers
for delete
to authenticated
using (auth.uid() = user_id);
