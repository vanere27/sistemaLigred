const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth.middleware');
const roles = require('../middleware/roles.middleware');
const prisma = new PrismaClient();

// GET - todos pueden ver
router.get('/', auth, async (req, res) => {
  const mantenimientos = await prisma.mantenimiento.findMany();
  res.json(mantenimientos);
});

// POST - solo admin
router.post('/', auth, roles('admin'), async (req, res) => {
  const mantenimiento = await prisma.mantenimiento.create({ data: req.body });
  res.json(mantenimiento);
});

// PUT - solo admin
router.put('/:id', auth, roles('admin'), async (req, res) => {
  const mantenimiento = await prisma.mantenimiento.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(mantenimiento);
});

// DELETE - solo admin
router.delete('/:id', auth, roles('admin'), async (req, res) => {
  await prisma.mantenimiento.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ ok: true });
});

module.exports = router;
