const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const { SECRET_KEY } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para registro y login de usuarios
 */

// 🔹 Registrar usuario
router.post('/register', async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
  }

  try {
    // Verificar si el usuario ya existe
    const result = await db.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Insertar nuevo usuario
    await db.query('INSERT INTO usuarios (usuario, password) VALUES ($1, MD5($2))', [usuario, password]);
    res.json({ message: 'Usuario registrado correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// 🔹 Login de usuario
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;
  try {
    const result = await db.query(
      'SELECT id, usuario FROM usuarios WHERE usuario = $1 AND password = MD5($2)',
      [usuario, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, usuario: user.usuario },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
