const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middlewares/auth');

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.id, p.nombre, p.precio, c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { nombre, precio, categoria_id } = req.body;
  if (!nombre || !precio || !categoria_id) {
    return res.status(400).json({ error: "Faltan datos" });
  }
  try {
    const result = await db.query(
      'INSERT INTO productos (nombre, precio, categoria_id) VALUES ($1, $2, $3) RETURNING id',
      [nombre, precio, categoria_id]
    );
    res.json({ id: result.rows[0].id, nombre, precio, categoria_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria_id } = req.body;
  try {
    await db.query(
      'UPDATE productos SET nombre = $1, precio = $2, categoria_id = $3 WHERE id = $4',
      [nombre, precio, categoria_id, id]
    );
    res.json({ id, nombre, precio, categoria_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM productos WHERE id = $1', [id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
