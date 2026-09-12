import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Workspace
  const workspace = await prisma.workspace.create({
    data: { name: 'Demo Workspace' },
  })

  // 2. Create 3 Users (Admin, Analyst, Viewer)
  await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@demo.com', role: 'ADMIN', workspaceId: workspace.id },
  })
  await prisma.user.create({
    data: { name: 'Analyst User', email: 'analyst@demo.com', role: 'ANALYST', workspaceId: workspace.id },
  })
  await prisma.user.create({
    data: { name: 'Viewer User', email: 'viewer@demo.com', role: 'VIEWER', workspaceId: workspace.id },
  })

  // 3. Create Themes
  await prisma.theme.create({ data: { name: 'UI/UX' } })
  await prisma.theme.create({ data: { name: 'Bug Report' } })
  await prisma.theme.create({ data: { name: 'Feature Request' } })

  // 4. Create Feedbacks
  for (let i = 1; i <= 120; i++) {
    await prisma.feedback.create({
      data: {
        content: `Sample feedback record #${i} for demo workspace.`,
        workspaceId: workspace.id,
      },
    })
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })