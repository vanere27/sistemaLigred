const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth.middleware');
const roles = require('../middleware/roles.middleware');
const prisma = new PrismaClient();

// GET todos los usuarios - solo admin
router.get('/', auth, roles('admin'), async (req, res) => {
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, nombre: true, email: true, rol: true, activo: true }
  });
  res.json(usuarios);
});

// GET solo profesores - para el desplegable de equipos
router.get('/profesores', auth, async (req, res) => {
  const profesores = await prisma.usuario.findMany({
    where: { rol: 'profesor' },
    select: { id: true, nombre: true, email: true }
  });
  res.json(profesores);
});

// DELETE - solo admin
router.delete('/:id', auth, roles('admin'), async (req, res) => {
  await prisma.usuario.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ ok: true });
});

module.exports = router;