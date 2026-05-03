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

alter table orders add column if not exists work_status text default 'pending';
alter table orders add column if not exists source text default 'Website';
alter table orders add column if not exists assigned_expert text;
alter table orders add column if not exists internal_notes text;
alter table orders add column if not exists verification jsonb default '{"emailVerified": false, "phoneVerified": false}'::jsonb;
alter table orders add column if not exists pricing_breakdown jsonb default '{}'::jsonb;
alter table orders add column if not exists total_amount numeric(12,2);
alter table orders add column if not exists gst_rate numeric(5,2);
alter table orders add column if not exists gst_amount numeric(12,2);
alter table orders add column if not exists advance_amount numeric(12,2);
alter table orders add column if not exists balance_amount numeric(12,2);
alter table orders add column if not exists delivery_files jsonb default '[]'::jsonb;

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

create table if not exists payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  amount numeric(12,2) not null,
  type text not null default 'advance',
  method text not null default 'UPI',
  reference_number text,
  razorpay_payment_id text,
  razorpay_order_id text,
  status text not null default 'captured',
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_payment_transactions_order on payment_transactions (order_id);

create table if not exists service_pricing (
  id uuid primary key default gen_random_uuid(),
  service_name text not null unique,
  base_price numeric(12,2) not null default 0,
  price_per_page numeric(12,2) not null default 0,
  price_per_word numeric(12,4) not null default 0,
  urgent_multiplier numeric(6,2) not null default 1,
  min_price numeric(12,2) not null default 0,
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  gst_rate numeric(5,2) not null default 18,
  advance_percent numeric(5,2) not null default 50,
  whatsapp_number text,
  support_email text,
  working_hours text,
  site_title text,
  site_meta_description text,
  site_og_image_url text,
  google_analytics_id text,
  razorpay_key_id text,
  razorpay_key_secret text,
  updated_at timestamptz not null default now()
);

insert into site_settings (gst_rate, advance_percent, whatsapp_number, support_email, working_hours, site_title, site_meta_description)
select 18, 50, '+917678182421', 'researchscholars.online@gmail.com', 'Mon-Sat 9:00-21:00 IST', 'ResearchScholars.online', 'PhD-led academic support'
where not exists (select 1 from site_settings);

create table if not exists blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  color text not null default '#1F7A45',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  cover_image_url text,
  content jsonb not null default '[]'::jsonb,
  author_name text,
  author_avatar_url text,
  author_designation text,
  category text,
  tags text[] not null default '{}',
  meta_title text,
  meta_description text,
  focus_keyword text,
  og_image_url text,
  reading_time_minutes int not null default 1,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  view_count int not null default 0
);

create index if not exists idx_blogs_published_at on blogs (is_published, published_at desc);
create index if not exists idx_blogs_slug on blogs (slug);
create index if not exists idx_blogs_category on blogs (category);

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

alter table blogs enable row level security;
alter table blog_categories enable row level security;
alter table service_pricing enable row level security;
alter table site_settings enable row level security;
alter table payment_transactions enable row level security;

create policy "public_read_published_blogs" on blogs
  for select to anon using (is_published = true);
create policy "service_full_blogs" on blogs
  for all to service_role using (true);

create policy "public_read_blog_categories" on blog_categories
  for select to anon using (true);
create policy "service_full_blog_categories" on blog_categories
  for all to service_role using (true);

create policy "public_read_service_pricing" on service_pricing
  for select to anon using (true);
create policy "service_full_service_pricing" on service_pricing
  for all to service_role using (true);

create policy "service_full_site_settings" on site_settings
  for all to service_role using (true);
create policy "service_full_payment_transactions" on payment_transactions
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
