-- ============================================================
-- ResearchScholar — Supabase Schema
-- Run this in your Supabase project → SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUM types
-- ============================================================
create type order_status as enum (
  'pending', 'in_progress', 'revision', 'delivered', 'completed', 'cancelled'
);

create type payment_status as enum (
  'paid', 'pending', 'partial', 'refunded'
);

create type payment_method as enum (
  'UPI', 'Card', 'Net Banking', 'Wallet', 'Simulation'
);

-- ============================================================
-- CUSTOMERS table
-- ============================================================
create table if not exists customers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null unique,
  phone        text,
  institution  text,
  created_at   timestamptz not null default now(),
  total_orders int not null default 0,
  total_spent  numeric(12,2) not null default 0
);

create index if not exists idx_customers_email on customers (email);
create index if not exists idx_customers_created_at on customers (created_at desc);

-- ============================================================
-- ORDERS table
-- ============================================================
create table if not exists orders (
  id              uuid primary key default gen_random_uuid(),
  order_no        text not null unique,
  customer_id     uuid references customers(id) on delete set null,
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text,
  service         text not null,
  topic           text,
  requirements    text,
  price           numeric(12,2) not null,
  status          order_status not null default 'pending',
  payment_status  payment_status not null default 'pending',
  notes           text,
  delivered_file  text,   -- Supabase Storage public URL
  deadline        date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_orders_status        on orders (status);
create index if not exists idx_orders_created_at    on orders (created_at desc);
create index if not exists idx_orders_customer_id   on orders (customer_id);
create index if not exists idx_orders_customer_email on orders (customer_email);
create index if not exists idx_orders_order_no      on orders (order_no);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ============================================================
-- Auto-increment order number (RS-00001 format)
-- ============================================================
create sequence if not exists order_seq start 1 increment 1;

create or replace function generate_order_no()
returns trigger language plpgsql as $$
begin
  if new.order_no is null or new.order_no = '' then
    new.order_no := 'RS-' || lpad(nextval('order_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

create trigger set_order_no
  before insert on orders
  for each row execute function generate_order_no();

-- ============================================================
-- PAYMENTS table
-- ============================================================
create table if not exists payments (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid references orders(id) on delete cascade,
  order_no       text not null,
  customer_name  text not null,
  customer_email text not null,
  amount         numeric(12,2) not null,
  method         payment_method not null default 'Simulation',
  status         payment_status not null default 'paid',
  paid_on        timestamptz not null default now()
);

create index if not exists idx_payments_order_id   on payments (order_id);
create index if not exists idx_payments_status     on payments (status);
create index if not exists idx_payments_paid_on    on payments (paid_on desc);

-- ============================================================
-- STORAGE bucket (run separately or via Supabase UI)
-- ============================================================
-- In Supabase Dashboard → Storage → New bucket:
--   Name: deliveries
--   Public: true (so download links work without auth)
-- OR run via Supabase JS client after setup.

-- ============================================================
-- Row Level Security
-- ============================================================

-- Orders: anon can INSERT only (for public order placement)
-- Service role has full access (used by server actions)
alter table orders enable row level security;

create policy "anon_insert_orders" on orders
  for insert to anon with check (true);

create policy "service_full_orders" on orders
  for all to service_role using (true);

-- Payments: same pattern
alter table payments enable row level security;

create policy "anon_insert_payments" on payments
  for insert to anon with check (true);

create policy "service_full_payments" on payments
  for all to service_role using (true);

-- Customers: anon can upsert (insert or update own record)
alter table customers enable row level security;

create policy "anon_upsert_customers" on customers
  for insert to anon with check (true);

create policy "anon_update_customers" on customers
  for update to anon using (true);

create policy "service_full_customers" on customers
  for all to service_role using (true);

-- ============================================================
-- Helper function: upsert customer and return id
-- ============================================================
create or replace function upsert_customer(
  p_name        text,
  p_email       text,
  p_phone       text,
  p_institution text
) returns uuid language plpgsql security definer as $$
declare
  v_id uuid;
begin
  insert into customers (name, email, phone, institution)
  values (p_name, p_email, p_phone, p_institution)
  on conflict (email) do update
    set name        = excluded.name,
        phone       = coalesce(excluded.phone, customers.phone),
        institution = coalesce(excluded.institution, customers.institution)
  returning id into v_id;
  return v_id;
end;
$$;
