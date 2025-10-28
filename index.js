require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { swaggerDocs } = require('./swagger');

// Verificar variables de entorno requeridas
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('Error: JWT_SECRET no está definido');
  process.exit(1);
}

const app = express();

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('frontend')); // Servir archivos estáticos desde la carpeta frontend

// Rutas
try {
  console.log('-> Registrando ruta /api/auth');
  app.use('/api/auth', require('./routes/auth'));
} catch (e) {
  console.error('Error registrando /api/auth', e);
  throw e;
}

try {
  console.log('-> Registrando ruta /api/categorias');
  app.use('/api/categorias', require('./routes/categorias'));
} catch (e) {
  console.error('Error registrando /api/categorias', e);
  throw e;
}

try {
  console.log('-> Registrando ruta /api/productos');
  app.use('/api/productos', require('./routes/productos'));
} catch (e) {
  console.error('Error registrando /api/productos', e);
  throw e;
}

try {
  console.log('-> Registrando ruta /api/imagenes');
  app.use('/api/imagenes', require('./routes/imagenes'));
} catch (e) {
  console.error('Error registrando /api/imagenes', e);
  throw e;
}

// Documentación Swagger (temporalmente deshabilitado para depurar error)
// swaggerDocs(app);

// Ruta para manejar todas las solicitudes que no sean API
// Usamos app.use en lugar de app.get('*') para evitar pasar la cadena '*'
// a path-to-regexp (algunas versiones no aceptan '*' sin nombre de parámetro).
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  }
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
