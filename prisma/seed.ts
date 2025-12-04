import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function seed() {
  const roles = ['admin', 'teacher', 'student'];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }
}

seed()
  .catch((e) => {
    console.error('Seed failed!');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
