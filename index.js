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
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/imagenes', require('./routes/imagenes'));

// Documentación Swagger
swaggerDocs(app);

// Ruta para manejar todas las solicitudes que no sean API
app.get('*', (req, res) => {
  // Si la ruta no empieza con /api, servimos el index.html
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
