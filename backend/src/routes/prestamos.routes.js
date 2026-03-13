const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth.middleware');
const roles = require('../middleware/roles.middleware');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const prestamos = await prisma.prestamo.findMany({
    include: { equipo: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(prestamos);
});

router.post('/', auth, roles('admin', 'profesor'), async (req, res) => {
  const { equipoId, solicitante, fechaSalida, fechaRetorno, notas } = req.body;
  const prestamo = await prisma.prestamo.create({
    data: {
      equipoId: parseInt(equipoId),
      solicitante,
      fechaSalida: new Date(fechaSalida),
      fechaRetorno: new Date(fechaRetorno),
      notas: notas || '',
      estado: 'Activo'
    },
    include: { equipo: true }
  });
  // Actualizar estado del equipo a Prestado
  await prisma.equipo.update({
    where: { id: parseInt(equipoId) },
    data: { estado: 'Prestado', prestadoA: solicitante }
  });
  res.json(prestamo);
});

router.put('/:id', auth, roles('admin', 'profesor'), async (req, res) => {
  const prestamo = await prisma.prestamo.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  // Si se marca como devuelto, actualizar el equipo
  if (req.body.estado === 'Devuelto') {
    await prisma.equipo.update({
      where: { id: prestamo.equipoId },
      data: { estado: 'Disponible', prestadoA: null }
    });
  }
  res.json(prestamo);
});

router.delete('/:id', auth, roles('admin'), async (req, res) => {
  await prisma.prestamo.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ ok: true });
});

module.exports = router;