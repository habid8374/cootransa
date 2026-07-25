-- ============================================================
-- COOTRANSA · Módulo de Proveedores / Contratistas
-- Postulación pública → estudio en el admin → selección confidencial
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

create table if not exists proveedor_postulaciones (
  id uuid primary key default gen_random_uuid(),
  empresa text not null,
  nit text,
  contacto text not null,
  cargo text,
  telefono text not null,
  correo text not null,
  ciudad text,
  categoria text not null,
  descripcion text not null,
  sitio_web text,
  documentos jsonb default '[]'::jsonb,     -- PDFs de propuestas (rutas del bucket privado)
  estado text not null default 'pendiente'
    check (estado in ('pendiente','en_estudio','seleccionado','descartado')),
  nota_interna text,                        -- notas confidenciales del admin
  created_at timestamptz default now()
);

create index if not exists idx_prov_estado  on proveedor_postulaciones(estado);
create index if not exists idx_prov_created on proveedor_postulaciones(created_at);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table proveedor_postulaciones enable row level security;

-- Cualquiera puede POSTULARSE (formulario público)
create policy "prov crear publico" on proveedor_postulaciones
  for insert with check (true);

-- Solo el admin autenticado ve y gestiona las postulaciones (NO hay lectura pública)
create policy "prov admin select" on proveedor_postulaciones
  for select using (auth.role() = 'authenticated');
create policy "prov admin update" on proveedor_postulaciones
  for update using (auth.role() = 'authenticated');
create policy "prov admin delete" on proveedor_postulaciones
  for delete using (auth.role() = 'authenticated');

-- ============================================================
-- Bucket privado para las propuestas (PDFs). NO público.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('proveedor-docs', 'proveedor-docs', false)
on conflict (id) do nothing;

-- Cualquiera puede SUBIR su propuesta al postularse...
drop policy if exists "provdocs insert" on storage.objects;
create policy "provdocs insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'proveedor-docs');

-- ...pero solo el admin autenticado puede LEERLAS (vía URL firmada temporal)
drop policy if exists "provdocs select admin" on storage.objects;
create policy "provdocs select admin" on storage.objects
  for select to authenticated
  using (bucket_id = 'proveedor-docs');
