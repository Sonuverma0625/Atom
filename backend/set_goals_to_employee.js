const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update all goals to be owned by the Employee (User 3)
  // And set their status to 'Pending Approval' so the manager can approve them
  await prisma.goal.updateMany({
    data: { 
      ownerId: 3,
      status: 'Pending Approval'
    }
  });
  console.log('All goals assigned to Employee and set to Pending Approval!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
