# ABM de Alumnos — Proyecto educativo

API REST (Node.js + Express) + Base de datos (SQLite) + Frontend (HTML/CSS/JS vanilla).
Pensado para enseñar el ciclo completo de un ABM: **A**lta, **B**aja, **M**odificación y Listado.

## Estructura del proyecto

```
abm-alumnos/
├── backend/
│   ├── server.js        # API REST + conexión a SQLite
│   ├── package.json
│   └── alumnos.db       # se crea sola al arrancar (no se sube al repo)
├── frontend/
│   └── index.html       # UI del ABM (se sirve desde el mismo backend)
└── README.md
```

## Cómo correrlo localmente

1. Necesitás [Node.js](https://nodejs.org) instalado (versión 18 o superior).
2. Abrí una terminal en la carpeta `backend/` e instalá dependencias:
   ```bash
   cd backend
   npm install
   ```
3. Levantá el servidor:
   ```bash
   npm start
   ```
4. Abrí el navegador en **http://localhost:3000** — ahí vas a ver el ABM funcionando, ya que el backend también sirve el frontend.

La base de datos (`alumnos.db`) se crea automáticamente la primera vez que arranca el servidor. No hace falta instalar MySQL, Postgres ni nada externo.

## Endpoints de la API

| Método | Ruta                  | Acción                        |
|--------|-----------------------|--------------------------------|
| GET    | `/api/alumnos`        | Listar todos los alumnos       |
| GET    | `/api/alumnos/:id`    | Obtener un alumno por ID       |
| POST   | `/api/alumnos`        | Alta (crear) un alumno         |
| PUT    | `/api/alumnos/:id`    | Modificar un alumno existente  |
| DELETE | `/api/alumnos/:id`    | Baja (borrar) un alumno        |

Body esperado para POST/PUT:
```json
{ "nombre": "Ana Pérez", "email": "ana@correo.com", "curso": "Programación III" }
```

## Cómo publicarlo gratis (para que los alumnos lo vean online)

### Opción recomendada: Render

1. Subí este proyecto a un repositorio en GitHub.
2. Entrá a [render.com](https://render.com) y creá una cuenta gratis.
3. "New +" → "Web Service" → conectá tu repo de GitHub.
4. Configurá:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. Render te da una URL pública tipo `https://tu-abm.onrender.com` — ahí queda funcionando el ABM completo (API + frontend).

⚠️ Nota sobre SQLite en Render (plan free): el disco no es persistente entre reinicios/deploys, así que la base se reinicia de tanto en tanto. Para una clase o demo está perfecto; si querés persistencia real, el siguiente paso natural es migrar a Postgres gratis en **Supabase** o **Neon** (cambiando solo la capa de conexión a la base, la API y el frontend quedan iguales).

### Alternativas también gratis

- **Railway** (railway.app): muy similar a Render, con free tier con créditos mensuales.
- **Cyclic** o **Fly.io**: otras opciones con capa gratuita para Node.js.
- **GitHub Pages**: sirve solo si querés publicar *únicamente* el frontend (por ejemplo, si migrás la API a Supabase y el frontend le pega directo a esa API desde el navegador).

## Para usar con Karate (testing de la API)

Los 4 endpoints están pensados para probarse fácil con Karate:
- `POST /api/alumnos` → status 201
- `GET /api/alumnos` → status 200, devuelve array
- `PUT /api/alumnos/:id` → status 200
- `DELETE /api/alumnos/:id` → status 204

Si querés, pedime el set de tests `.feature` de ejemplo para este mismo proyecto.

## Ideas para que los alumnos extiendan el proyecto

- Agregar paginación al listado.
- Agregar un campo de "fecha de nacimiento" y validarlo.
- Sumar autenticación básica (JWT) para proteger el Alta/Baja/Modificación.
- Migrar de SQLite a PostgreSQL (Supabase/Neon) y comparar diferencias.
- Escribir tests con Karate o Jest para cada endpoint.
