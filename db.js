// db.js
require('dotenv').config();
const env = process.env.NODE_ENV || 'local';
let db;

if (env === 'local') {
  // 🔹 Base de datos local (MySQL)
  const mysql = require('mysql2');
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tienda',
  });
  db = pool.promise();
  console.log('✅ Conectado a MySQL (modo local)');
} else {
  // 🔹 Base de datos en Render (PostgreSQL)
  const { Pool } = require('pg');
  const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false },
  });
  db = {
    query: (text, params) => pool.query(text, params),
  };
  console.log('🌐 Conectado a PostgreSQL (Render)');
}

module.exports = db;
