import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();

    console.log(`Database running on port: ${process.env.PG_PORT}`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();

export default prisma;
