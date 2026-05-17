const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.goal.updateMany({
    data: { status: 'Approved' }
  });
  console.log('All goals have been automatically approved!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
