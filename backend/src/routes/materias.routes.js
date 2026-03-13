const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth.middleware');
const roles = require('../middleware/roles.middleware');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const materias = await prisma.materia.findMany({
    include: { profesor: { select: { id: true, nombre: true, email: true } } }
  });
  res.json(materias);
});

router.post('/', auth, roles('admin'), async (req, res) => {
  const { nombre, codigo, profesorId } = req.body;
  const materia = await prisma.materia.create({
    data: {
      nombre,
      codigo,
      profesorId: profesorId ? parseInt(profesorId) : null,
    },
    include: { profesor: { select: { id: true, nombre: true, email: true } } }
  });
  res.json(materia);
});

router.put('/:id', auth, roles('admin'), async (req, res) => {
  const { nombre, codigo, profesorId } = req.body;
  const materia = await prisma.materia.update({
    where: { id: parseInt(req.params.id) },
    data: {
      nombre,
      codigo,
      profesorId: profesorId ? parseInt(profesorId) : null,
    },
    include: { profesor: { select: { id: true, nombre: true, email: true } } }
  });
  res.json(materia);
});

router.delete('/:id', auth, roles('admin'), async (req, res) => {
  await prisma.materia.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ ok: true });
});

module.exports = router;