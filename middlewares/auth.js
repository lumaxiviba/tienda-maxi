// middlewares/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'mi_secreto_ultra_seguro';

function verifyToken(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  if (!token) return res.status(403).json({ message: 'Token requerido' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido o expirado' });
    req.user = decoded; // { id, usuario }
    next();
  });
}

module.exports = { verifyToken, SECRET_KEY };
