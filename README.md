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
