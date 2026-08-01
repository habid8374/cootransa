-- ============================================================
-- COOTRANSA · Blog: comentarios moderados + separación del banner
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- 1) Separar el Blog del banner de inicio.
--    Se agrega una bandera; el banner solo muestra las marcadas.
--    Las noticias que HOY ya están publicadas se conservan en el banner.
alter table noticias add column if not exists en_banner boolean not null default false;
update noticias set en_banner = true where estado = 'publicado' and en_banner = false;

-- ============================================================
-- 2) Comentarios del Blog (moderados por el admin)
-- ============================================================

create table if not exists blog_comentarios (
  id uuid primary key default gen_random_uuid(),
  noticia_slug text not null,
  nombre text not null,
  email text,
  comentario text not null,
  aprobado boolean not null default false,   -- se publica solo cuando el admin lo aprueba
  created_at timestamptz default now()
);

create index if not exists idx_coment_slug     on blog_comentarios(noticia_slug);
create index if not exists idx_coment_aprobado on blog_comentarios(aprobado);

alter table blog_comentarios enable row level security;

-- Cualquiera puede ESCRIBIR un comentario (queda pendiente de aprobación)
drop policy if exists "coment crear publico" on blog_comentarios;
create policy "coment crear publico" on blog_comentarios
  for insert with check (true);

-- El público solo LEE los comentarios aprobados
drop policy if exists "coment leer aprobados" on blog_comentarios;
create policy "coment leer aprobados" on blog_comentarios
  for select using (aprobado = true);

-- El admin autenticado ve y gestiona TODO (incluye los pendientes)
drop policy if exists "coment admin select" on blog_comentarios;
create policy "coment admin select" on blog_comentarios
  for select using (auth.role() = 'authenticated');
drop policy if exists "coment admin update" on blog_comentarios;
create policy "coment admin update" on blog_comentarios
  for update using (auth.role() = 'authenticated');
drop policy if exists "coment admin delete" on blog_comentarios;
create policy "coment admin delete" on blog_comentarios
  for delete using (auth.role() = 'authenticated');
