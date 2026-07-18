-- ============================================================
-- COOTRANSA · Módulo de Carnets de Tarifa Preferencial (Fase 1-2)
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- Categorías de tarifa (administradas por COOTRANSA)
create table if not exists carnet_categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  activa boolean not null default true,
  created_at timestamptz default now()
);

-- Documentos requeridos (administrados por COOTRANSA)
create table if not exists carnet_documentos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  obligatorio boolean not null default true,
  activo boolean not null default true,
  orden int default 0,
  created_at timestamptz default now()
);

-- Solicitudes de carnet
create table if not exists carnet_solicitudes (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nombre text not null,
  cedula text not null,
  institucion text not null,
  direccion text not null,
  codigo_postal text,
  telefono text not null,
  correo text not null,
  categoria_id uuid references carnet_categorias(id) on delete set null,
  categoria_nombre text,
  foto_url text,
  documentos jsonb default '[]'::jsonb,
  estado text not null default 'pendiente' check (estado in ('pendiente','aprobado','rechazado')),
  motivo_rechazo text,
  vigencia_inicio date,
  vigencia_fin date,
  created_at timestamptz default now(),
  aprobado_at timestamptz
);

create index if not exists idx_carnet_estado on carnet_solicitudes(estado);
create index if not exists idx_carnet_created on carnet_solicitudes(created_at);
create index if not exists idx_carnet_codigo on carnet_solicitudes(codigo);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table carnet_categorias   enable row level security;
alter table carnet_documentos   enable row level security;
alter table carnet_solicitudes  enable row level security;

-- Categorías y documentos: lectura pública (el formulario los necesita)
create policy "cat lectura publica" on carnet_categorias for select using (true);
create policy "doc lectura publica" on carnet_documentos for select using (true);
-- ...y gestión solo para admin autenticado
create policy "cat admin" on carnet_categorias for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "doc admin" on carnet_documentos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Solicitudes: cualquiera puede CREAR (formulario público)
create policy "sol crear publico" on carnet_solicitudes for insert with check (true);
-- Lectura pública SOLO de aprobadas (para carnet y verificación por QR)
create policy "sol lectura aprobadas" on carnet_solicitudes for select using (estado = 'aprobado');
-- El admin autenticado ve y gestiona todo
create policy "sol admin select" on carnet_solicitudes for select using (auth.role() = 'authenticated');
create policy "sol admin update" on carnet_solicitudes for update using (auth.role() = 'authenticated');
create policy "sol admin delete" on carnet_solicitudes for delete using (auth.role() = 'authenticated');

-- ============================================================
-- Datos de ejemplo (opcional — puedes borrarlos o editarlos en el admin)
-- ============================================================
insert into carnet_categorias (nombre, descripcion) values
  ('Estudiante', 'Estudiantes de instituciones educativas'),
  ('Estudiante Barranquilla', 'Estudiantes que viajan a Barranquilla')
on conflict do nothing;

insert into carnet_documentos (nombre, descripcion, obligatorio, orden) values
  ('Documento de identidad', 'Cédula o tarjeta de identidad (PDF o foto)', true, 0),
  ('Certificado de matrícula', 'Certificado vigente de la institución educativa', true, 1),
  ('Carnet estudiantil', 'Foto del carnet estudiantil (opcional)', false, 2)
on conflict do nothing;

-- ============================================================
-- IMPORTANTE: el bucket de storage 'cootransa-media' ya existe y es público.
-- Las fotos y documentos se guardan en la carpeta 'carnets/'.
-- ============================================================

-- ============================================================
-- FASE 3 · Config segura de notificaciones (Brevo)
-- Solo el admin autenticado puede leer/escribir (la API key NO es pública)
-- ============================================================
create table if not exists notif_config (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

alter table notif_config enable row level security;

create policy "notif admin all" on notif_config
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
