const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log("Users in DB:", JSON.stringify(users, null, 2));
  const goals = await prisma.goal.findMany();
  console.log("Goals in DB:", JSON.stringify(goals, null, 2));
}
main().finally(() => prisma.$disconnect());
