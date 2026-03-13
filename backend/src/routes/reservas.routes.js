const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth.middleware');
const roles = require('../middleware/roles.middleware');
const prisma = new PrismaClient();

// GET - todos pueden ver
router.get('/', auth, async (req, res) => {
  const reservas = await prisma.reserva.findMany();
  res.json(reservas);
});

// POST - solo admin
router.post('/', auth, roles('admin'), async (req, res) => {
  const reserva = await prisma.reserva.create({ data: req.body });
  res.json(reserva);
});

// PUT - solo admin
router.put('/:id', auth, roles('admin'), async (req, res) => {
  const reserva = await prisma.reserva.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(reserva
  );
});

// DELETE - solo admin
router.delete('/:id', auth, roles('admin'), async (req, res) => {
  await prisma.reserva.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ ok: true });
});

module.exports = router;
