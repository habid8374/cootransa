-- ============================================================
-- COOTRANSA · Blog: galería de fotos en las publicaciones
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- Guarda varias fotos por publicación (carrusel). La portada sigue en image_url.
alter table noticias add column if not exists galeria jsonb default '[]'::jsonb;

-- Las publicaciones que ya tienen una imagen la conservan como primera de la galería.
update noticias
set galeria = jsonb_build_array(image_url)
where (galeria is null or galeria = '[]'::jsonb)
  and image_url is not null and image_url <> '';
