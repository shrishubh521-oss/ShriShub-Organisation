create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  subject text not null,
  body text not null,
  reply text,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.messages
  add column if not exists reply text,
  add column if not exists replied_at timestamptz;
