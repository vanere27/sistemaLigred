const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.usuario.create({
    data: {
      nombre: 'Administrador LIGRED',
      email: 'admin@ligred.edu',
      password: hash,
      rol: 'admin'
    }
  });
  console.log('Admin creado exitosamente');
}

main().catch(console.error).finally(() => prisma.$disconnect());
