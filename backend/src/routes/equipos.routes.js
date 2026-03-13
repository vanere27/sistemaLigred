const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth.middleware');
const roles = require('../middleware/roles.middleware');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const equipos = await prisma.equipo.findMany({
    include: { encargado: { select: { id: true, nombre: true, rol: true } } }
  });
  res.json(equipos);
});

router.post('/', auth, roles('admin'), async (req, res) => {
  const { codigo, descripcion, categoria, ubicacion, estado, encargadoId, prestadoA } = req.body;
  const equipo = await prisma.equipo.create({
    data: {
      codigo, descripcion, categoria, ubicacion, estado,
      encargadoId: encargadoId ? parseInt(encargadoId) : null,
      prestadoA: estado === 'Prestado' ? prestadoA : null,
    },
    include: { encargado: { select: { id: true, nombre: true, rol: true } } }
  });
  res.json(equipo);
});

router.put('/:id', auth, roles('admin'), async (req, res) => {
  const { codigo, descripcion, categoria, ubicacion, estado, encargadoId, prestadoA } = req.body;
  const equipo = await prisma.equipo.update({
    where: { id: parseInt(req.params.id) },
    data: {
      codigo, descripcion, categoria, ubicacion, estado,
      encargadoId: encargadoId ? parseInt(encargadoId) : null,
      prestadoA: estado === 'Prestado' ? prestadoA : null,
    },
    include: { encargado: { select: { id: true, nombre: true, rol: true } } }
  });
  res.json(equipo);
});

router.delete('/:id', auth, roles('admin'), async (req, res) => {
  const id = parseInt(req.params.id)
  await prisma.prestamo.deleteMany({ where: { equipoId: id } })
  await prisma.mantenimiento.deleteMany({ where: { equipoId: id } })
  await prisma.equipo.delete({ where: { id } })
  res.json({ ok: true })
});
module.exports = router;