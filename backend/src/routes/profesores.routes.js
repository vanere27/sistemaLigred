const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth.middleware');
const roles = require('../middleware/roles.middleware');
const prisma = new PrismaClient();

// GET - todos pueden ver
router.get('/', auth, async (req, res) => {
  const profesores = await prisma.profesor.findMany();
  res.json(profesores);
});

// POST - solo admin
router.post('/', auth, roles('admin'), async (req, res) => {
  const profesor = await prisma.profesor.create({ data: req.body });
  res.json(profesor);
});

// PUT - solo admin
router.put('/:id', auth, roles('admin'), async (req, res) => {
  const profesor = await prisma.profesor.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(profesor);
});

// DELETE - solo admin
router.delete('/:id', auth, roles('admin'), async (req, res) => {
  await prisma.profesor.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ ok: true });
});

module.exports = router;