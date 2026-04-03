import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const adminPassword = await bcrypt.hash('admin123456', 12)
  const userPassword = await bcrypt.hash('user123456', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
      status: 'ACTIVE',
    },
  })

  console.log('✅ Seeded users:')
  console.log(`  Admin: ${admin.email} / admin123456`)
  console.log(`  User:  ${user.email} / user123456`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
