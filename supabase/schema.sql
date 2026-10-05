-- Run this in Supabase SQL Editor.
-- After creating your first account, promote the intended owner to admin:
-- update public.profiles set role = 'admin' where id = 'YOUR_AUTH_USER_UUID';

create extension if not exists "pgcrypto";

do $$
begin
  create type public.user_role as enum ('customer', 'admin');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum ('pending', 'contract_pending', 'payment_pending', 'in_progress', 'review', 'completed', 'cancelled');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  service_type text not null,
  requirements text not null,
  timeline text,
  quoted_price numeric(12,2) not null default 0,
  status public.order_status not null default 'pending',
  contract_accepted boolean not null default false,
  payment_status text not null default 'unpaid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.contact_messages enable row level security;
alter table public.messages enable row level security;

drop policy if exists "profiles own select" on public.profiles;
create policy "profiles own select" on public.profiles
for select using (id = auth.uid() or public.is_admin());

drop policy if exists "orders customer select" on public.orders;
create policy "orders customer select" on public.orders
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders customer insert" on public.orders;
create policy "orders customer insert" on public.orders
for insert with check (user_id = auth.uid());

drop policy if exists "orders customer update" on public.orders;
create policy "orders customer update" on public.orders
for update using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "messages customer select" on public.messages;
create policy "messages customer select" on public.messages
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "contact public insert" on public.contact_messages;
create policy "contact public insert" on public.contact_messages
for insert with check (user_id = auth.uid() or user_id is null);

drop policy if exists "contact admin select" on public.contact_messages;
create policy "contact admin select" on public.contact_messages
for select using (public.is_admin());

-- Only an admin should be able to create internal customer messages.
drop policy if exists "messages admin insert" on public.messages;
create policy "messages admin insert" on public.messages
for insert with check (public.is_admin());
