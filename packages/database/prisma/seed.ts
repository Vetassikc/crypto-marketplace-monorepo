import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const seller = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      name: 'Test Seller',
      role: Role.SELLER,
      wallets: {
        create: {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          network: 'tempo',
        },
      },
    },
  })
  console.log({ seller })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
