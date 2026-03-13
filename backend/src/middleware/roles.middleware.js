// Uso: router.delete('/:id', auth, roles('admin'), handler)
module.exports = (...rolesPermitidos) => (req, res, next) => {
  if (!rolesPermitidos.includes(req.user.rol)) {
    return res.status(403).json({ error: 'Sin permisos' });
  }
  next();
};

