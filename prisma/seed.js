const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Database seed ho raha hai...');

  // 1. Workspace
  const workspace = await prisma.workspace.create({
    data: { name: 'Demo Workspace' },
  });

  // 2. Users
  await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@demo.com', role: 'ADMIN', workspaceId: workspace.id },
  });
  await prisma.user.create({
    data: { name: 'Analyst User', email: 'analyst@demo.com', role: 'ANALYST', workspaceId: workspace.id },
  });
  await prisma.user.create({
    data: { name: 'Viewer User', email: 'viewer@demo.com', role: 'VIEWER', workspaceId: workspace.id },
  });

  // 3. Themes
  await prisma.theme.create({ data: { name: 'UI/UX' } });
  await prisma.theme.create({ data: { name: 'Bug Report' } });

  // 4. Feedbacks (120 Records)
  for (let i = 1; i <= 120; i++) {
    await prisma.feedback.create({
      data: {
        content: `Sample feedback #${i} for workspace`,
        workspaceId: workspace.id,
      },
    });
  }

  console.log('DONE! Database Seed Ho Gaya!');
}

main()
  .catch((e) => {
    console.error('Error aaya:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });