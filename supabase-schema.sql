create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null,
  main_image text not null,
  sub_images jsonb not null default '[]'::jsonb,
  price numeric not null check (price >= 0),
  discounted_price numeric check (discounted_price is null or discounted_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  enquired_stock integer not null default 0 check (enquired_stock >= 0),
  rating numeric default 5 check (rating is null or (rating >= 0 and rating <= 5)),
  reviews_count integer not null default 0 check (reviews_count >= 0),
  free_shipping boolean not null default false,
  estimated_delivery text not null default '5-7 business days',
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated admins can insert products" on public.products;
create policy "Authenticated admins can insert products"
on public.products for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update products" on public.products;
create policy "Authenticated admins can update products"
on public.products for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can delete products" on public.products;
create policy "Authenticated admins can delete products"
on public.products for delete
to authenticated
using (true);

create or replace function public.increment_enquired_stock(product_id uuid, quantity integer)
returns void
language sql
security definer
set search_path = public
as $$
  update public.products
  set enquired_stock = enquired_stock + greatest(quantity, 0),
      updated_at = now()
  where id = product_id;
$$;

grant execute on function public.increment_enquired_stock(uuid, integer) to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'products');

drop policy if exists "Authenticated admins can upload product images" on storage.objects;
create policy "Authenticated admins can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'products');

drop policy if exists "Authenticated admins can update product images" on storage.objects;
create policy "Authenticated admins can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'products')
with check (bucket_id = 'products');

drop policy if exists "Authenticated admins can delete product images" on storage.objects;
create policy "Authenticated admins can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'products');
