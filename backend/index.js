
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./database.sqlite');

app.use(cors());
app.use(bodyParser.json());

// Crear tabla usuarios si no existe
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  apellido TEXT,
  edad INTEGER,
  fecha_nacimiento TEXT,
  email TEXT UNIQUE,
  password TEXT
)`);

// Registro de usuario
app.post('/api/registro', (req, res) => {
  const { nombre, apellido, edad, fecha_nacimiento, email, password } = req.body;
  db.run(
    `INSERT INTO usuarios (nombre, apellido, edad, fecha_nacimiento, email, password) VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, apellido, edad, fecha_nacimiento, email, password],
    function (err) {
      if (err) return res.status(400).json({ error: 'Email ya registrado' });
      res.json({ success: true });
    }
  );
});

// Inicio de sesión
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get(
    `SELECT * FROM usuarios WHERE email = ? AND password = ?`,
    [email, password],
    (err, row) => {
      if (row) return res.json({ success: true, user: row });
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  );
});

app.listen(3000, () => {
  console.log('Servidor backend escuchando en http://localhost:3000');
});

// Actualizar datos de usuario
app.post('/api/actualizar', (req, res) => {
  const { nombre, apellido, edad, fecha_nacimiento, email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'El email es obligatorio para actualizar.' });
  }
  db.run(
    `UPDATE usuarios SET nombre = ?, apellido = ?, edad = ?, fecha_nacimiento = ?, password = ? WHERE email = ?`,
    [nombre, apellido, edad, fecha_nacimiento, password, email],
    function (err) {
      if (err) return res.status(400).json({ error: 'No se pudo actualizar el usuario' });
      if (this.changes === 0) {
        return res.status(404).json({ error: 'No se encontró un usuario con ese email.' });
      }
      res.json({ success: true });
    }
  );
});