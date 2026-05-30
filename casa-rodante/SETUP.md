# Casa Rodante — Guía de setup

## 1. Supabase — crear el proyecto

1. Entrá a [supabase.com](https://supabase.com) y creá una cuenta gratis
2. Creá un nuevo proyecto (elegí la región más cercana, ej: South America)
3. Guardá la **URL** y la **anon key** que aparecen en Settings → API

---

## 2. Crear la tabla en Supabase

Andá a **SQL Editor** y ejecutá esto:

```sql
create table notas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  resumen text,
  cuerpo text,
  categoria text not null check (categoria in ('noticias','columna','entrevista','informe')),
  autor text,
  foto_url text,
  publicada boolean default false,
  created_at timestamptz default now()
);

-- Solo los usuarios autenticados pueden escribir/editar
alter table notas enable row level security;

create policy "Lectura pública de notas publicadas"
  on notas for select
  using (publicada = true);

create policy "Equipo puede hacer todo"
  on notas for all
  using (auth.role() = 'authenticated');
```

---

## 3. Crear el bucket de fotos

Andá a **Storage** y creá un bucket llamado `fotos` con acceso **público**.

---

## 4. Crear usuarios del equipo

Andá a **Authentication → Users → Invite user** y agregá el email de cada integrante.  
Ellos recibirán un email para crear su contraseña.  
**No hay registro abierto** — solo los que vos invitás pueden entrar.

---

## 5. Configurar el proyecto local

```bash
# Clonar / descomprimir el proyecto
cd casa-rodante

# Copiar el archivo de variables
cp .env.example .env

# Editar .env con tus datos de Supabase
REACT_APP_SUPABASE_URL=https://TU_PROYECTO.supabase.co
REACT_APP_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Instalar dependencias y correr
npm install
npm start
```

---

## 6. Deploy en Vercel

1. Subí el proyecto a GitHub
2. Importalo en [vercel.com](https://vercel.com)
3. En **Environment Variables** agregá las mismas dos variables del `.env`
4. Deploy → listo

---

## URLs

| Ruta | Quién accede |
|------|-------------|
| `/` | Todo el mundo |
| `/nota/:id` | Todo el mundo |
| `/redaccion/login` | Solo el equipo (URL no linkeada en ningún lado) |
| `/redaccion` | Solo el equipo autenticado |
