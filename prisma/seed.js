const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });
  await prisma.role.upsert({
    where: { name: "cashier" },
    update: {},
    create: { name: "cashier" },
  });
  console.log("Seeded roles.");
}

main().finally(() => prisma.$disconnect());
