// server.js
// API REST para un ABM (Alta, Baja, Modificacion) de Alumnos
// Base de datos: SQLite (archivo local, sin servidor externo)

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Servir el frontend estatico (para que backend + frontend vivan juntos)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// --- Base de datos ---
const db = new Database(path.join(__dirname, 'alumnos.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS alumnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    curso TEXT NOT NULL,
    creado_en TEXT DEFAULT (datetime('now'))
  )
`);

// --- Validacion simple ---
function validarAlumno(body) {
  const errores = [];
  if (!body.nombre || typeof body.nombre !== 'string' || body.nombre.trim().length < 2) {
    errores.push('El nombre es obligatorio (minimo 2 caracteres)');
  }
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errores.push('El email no es valido');
  }
  if (!body.curso || typeof body.curso !== 'string' || body.curso.trim().length < 2) {
    errores.push('El curso es obligatorio');
  }
  return errores;
}

// ===================== ENDPOINTS DEL ABM =====================

// LISTAR (Read) - GET /api/alumnos
app.get('/api/alumnos', (req, res) => {
  const alumnos = db.prepare('SELECT * FROM alumnos ORDER BY id DESC').all();
  res.json(alumnos);
});

// OBTENER UNO - GET /api/alumnos/:id
app.get('/api/alumnos/:id', (req, res) => {
  const alumno = db.prepare('SELECT * FROM alumnos WHERE id = ?').get(req.params.id);
  if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });
  res.json(alumno);
});

// ALTA (Create) - POST /api/alumnos
app.post('/api/alumnos', (req, res) => {
  const errores = validarAlumno(req.body);
  if (errores.length) return res.status(400).json({ errores });

  try {
    const stmt = db.prepare('INSERT INTO alumnos (nombre, email, curso) VALUES (?, ?, ?)');
    const info = stmt.run(req.body.nombre.trim(), req.body.email.trim(), req.body.curso.trim());
    const nuevo = db.prepare('SELECT * FROM alumnos WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(nuevo);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Ya existe un alumno con ese email' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// MODIFICACION (Update) - PUT /api/alumnos/:id
app.put('/api/alumnos/:id', (req, res) => {
  const existente = db.prepare('SELECT * FROM alumnos WHERE id = ?').get(req.params.id);
  if (!existente) return res.status(404).json({ error: 'Alumno no encontrado' });

  const errores = validarAlumno(req.body);
  if (errores.length) return res.status(400).json({ errores });

  try {
    db.prepare('UPDATE alumnos SET nombre = ?, email = ?, curso = ? WHERE id = ?')
      .run(req.body.nombre.trim(), req.body.email.trim(), req.body.curso.trim(), req.params.id);
    const actualizado = db.prepare('SELECT * FROM alumnos WHERE id = ?').get(req.params.id);
    res.json(actualizado);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Ya existe un alumno con ese email' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// BAJA (Delete) - DELETE /api/alumnos/:id
app.delete('/api/alumnos/:id', (req, res) => {
  const existente = db.prepare('SELECT * FROM alumnos WHERE id = ?').get(req.params.id);
  if (!existente) return res.status(404).json({ error: 'Alumno no encontrado' });

  db.prepare('DELETE FROM alumnos WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

// Health check (util para Render/Railway)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
