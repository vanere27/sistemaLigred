const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth.middleware');
const roles = require('../middleware/roles.middleware');
const prisma = new PrismaClient();

// GET - todos pueden ver
router.get('/', auth, async (req, res) => {
  const insumos = await prisma.insumo.findMany();
  res.json(insumos);
});

// POST - solo admin
router.post('/', auth, roles('admin'), async (req, res) => {
  const insumo = await prisma.insumo.create({ data: req.body });
  res.json(insumo);
});

// PUT - solo admin
router.put('/:id', auth, roles('admin'), async (req, res) => {
  const insumo = await prisma.insumo.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(insumo);
});

// DELETE - solo admin
router.delete('/:id', auth, roles('admin'), async (req, res) => {
  await prisma.insumo.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ ok: true });
});

module.exports = router;
