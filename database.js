const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'identidad.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    facultad TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    fecha_registro TEXT NOT NULL,
    cupon_usado INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS visitas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    ip TEXT,
    user_agent TEXT
  );

  CREATE TABLE IF NOT EXISTS clicks_productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id TEXT NOT NULL,
    producto_nombre TEXT,
    fecha TEXT NOT NULL,
    usuario_correo TEXT
  );

  CREATE TABLE IF NOT EXISTS ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id TEXT NOT NULL,
    producto_nombre TEXT NOT NULL,
    talla TEXT,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    total REAL NOT NULL,
    usuario_correo TEXT,
    fecha TEXT NOT NULL,
    mes INTEGER NOT NULL,
    anio INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS carrito (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_correo TEXT NOT NULL,
    producto_id TEXT NOT NULL,
    producto_nombre TEXT NOT NULL,
    talla TEXT,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    fecha TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TEXT NOT NULL
  );
`);

module.exports = db;