const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const ahora = () => new Date().toISOString();

// ============ REGISTRO DE USUARIO ============
app.post('/api/registro', (req, res) => {
  const { nombre, apellido, facultad, correo } = req.body;

  if (!nombre || !apellido || !facultad || !correo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  if (!correo.includes('@')) {
    return res.status(400).json({ error: 'Correo inválido.' });
  }

  try {
    const existe = db.prepare('SELECT id FROM usuarios WHERE correo = ?').get(correo);
    if (existe) {
      return res.json({ success: true, mensaje: 'Bienvenido de nuevo', usuario: { nombre, apellido, facultad, correo } });
    }

    db.prepare(`
      INSERT INTO usuarios (nombre, apellido, facultad, correo, fecha_registro)
      VALUES (?, ?, ?, ?, ?)
    `).run(nombre, apellido, facultad, correo, ahora());

    res.json({ success: true, mensaje: 'Registro exitoso', usuario: { nombre, apellido, facultad, correo } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ REGISTRAR VISITA ============
app.post('/api/visita', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress;
  const ua = req.headers['user-agent'] || '';
  db.prepare('INSERT INTO visitas (fecha, ip, user_agent) VALUES (?, ?, ?)').run(ahora(), ip, ua);
  res.json({ success: true });
});

// ============ REGISTRAR CLICK EN PRODUCTO ============
app.post('/api/click', (req, res) => {
  const { producto_id, producto_nombre, usuario_correo } = req.body;
  db.prepare(`
    INSERT INTO clicks_productos (producto_id, producto_nombre, fecha, usuario_correo)
    VALUES (?, ?, ?, ?)
  `).run(producto_id, producto_nombre || '', ahora(), usuario_correo || 'anonimo');
  res.json({ success: true });
});

// ============ REGISTRAR COMPRA ============
app.post('/api/compra', (req, res) => {
  const { producto_id, producto_nombre, talla, cantidad, precio_unitario, usuario_correo } = req.body;
  if (!producto_id || !cantidad || !precio_unitario) {
    return res.status(400).json({ error: 'Datos incompletos.' });
  }
  const total = cantidad * precio_unitario;
  const fecha = new Date();
  db.prepare(`
    INSERT INTO ventas (producto_id, producto_nombre, talla, cantidad, precio_unitario, total, usuario_correo, fecha, mes, anio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    producto_id, producto_nombre, talla || 'M', cantidad, precio_unitario, total,
    usuario_correo || 'anonimo', fecha.toISOString(), fecha.getMonth() + 1, fecha.getFullYear()
  );
  res.json({ success: true, total });
});

// ============ CARRITO ============
app.post('/api/carrito', (req, res) => {
  const { usuario_correo, producto_id, producto_nombre, talla, cantidad, precio_unitario } = req.body;
  db.prepare(`
    INSERT INTO carrito (usuario_correo, producto_id, producto_nombre, talla, cantidad, precio_unitario, fecha)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(usuario_correo, producto_id, producto_nombre, talla, cantidad, precio_unitario, ahora());
  res.json({ success: true });
});

app.get('/api/carrito/:correo', (req, res) => {
  const items = db.prepare('SELECT * FROM carrito WHERE usuario_correo = ?').all(req.params.correo);
  res.json(items);
});

// ============ CONTACTO ============
app.post('/api/contacto', (req, res) => {
  const { nombre, correo, mensaje } = req.body;
  if (!nombre || !correo || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  db.prepare('INSERT INTO mensajes_contacto (nombre, correo, mensaje, fecha) VALUES (?, ?, ?, ?)')
    .run(nombre, correo, mensaje, ahora());
  res.json({ success: true });
});

// ============ ADMIN ============
const ADMIN_CODE = '041169';

app.post('/api/admin/login', (req, res) => {
  const { codigo } = req.body;
  if (codigo === ADMIN_CODE) return res.json({ success: true });
  res.status(401).json({ error: 'Código incorrecto.' });
});

app.get('/api/admin/stats', (req, res) => {
  const visitantes = db.prepare('SELECT COUNT(*) as total FROM visitas').get().total;
  const clicks = db.prepare('SELECT COUNT(*) as total FROM clicks_productos').get().total;
  const registros = db.prepare('SELECT COUNT(*) as total FROM usuarios').get().total;
  const ventasTotales = db.prepare('SELECT COUNT(*) as total FROM ventas').get().total;
  const ingresos = db.prepare('SELECT COALESCE(SUM(total),0) as total FROM ventas').get().total;

  const productosFavoritos = db.prepare(`
    SELECT producto_nombre, COUNT(*) as clicks
    FROM clicks_productos
    GROUP BY producto_id
    ORDER BY clicks DESC
    LIMIT 5
  `).all();

  res.json({ visitantes, clicks, registros, ventasTotales, ingresos, productosFavoritos });
});

app.get('/api/admin/usuarios', (req, res) => {
  const usuarios = db.prepare('SELECT * FROM usuarios ORDER BY id DESC').all();
  res.json(usuarios);
});

app.get('/api/admin/ventas-mensuales', (req, res) => {
  const datos = db.prepare(`
    SELECT mes, anio, COUNT(*) as ventas, SUM(total) as ingresos
    FROM ventas
    GROUP BY anio, mes
    ORDER BY anio, mes
  `).all();
  res.json(datos);
});

app.get('/api/admin/exportar-csv', (req, res) => {
  const usuarios = db.prepare('SELECT * FROM usuarios ORDER BY id DESC').all();
  let csv = 'ID,Nombre,Apellido,Facultad,Correo,Fecha de registro\n';
  usuarios.forEach(u => {
    csv += `${u.id},"${u.nombre}","${u.apellido}","${u.facultad}","${u.correo}","${u.fecha_registro}"\n`;
  });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="registros_identidad_usm.csv"');
  res.send('\uFEFF' + csv);
});

// ============ INICIAR SERVIDOR ============
app.listen(PORT, () => {
  console.log(`✅ IDENTIDAD USM corriendo en http://localhost:${PORT}`);
});