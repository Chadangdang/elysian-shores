console.log(new Date().toISOString(), '– starting seed…')
import { PrismaClient } from '@prisma/client'
import { subDays, addDays, eachDayOfInterval } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  // 1. Upsert the 3 room types
  const types = [
    { id: 'room_1', name: 'Classic Room',   capacity: 20 },
    { id: 'room_2', name: 'Deluxe Suite',    capacity: 10 },
    { id: 'room_3', name: 'Executive Suite', capacity: 5  },
  ]
  for (const { id, name, capacity } of types) {
    await prisma.roomType.upsert({
      where: { id },
      create: { id, name, capacity },
      update: { name, capacity },
    })
  }

  // 2. Seed availability from May 12 → July 30, 2025
  const start = new Date(2025, 4, 12)   // month is zero-based (4 = May)
  const end   = new Date(2025, 6, 30)   // (6 = July)
  const days  = eachDayOfInterval({ start, end })

  for (const date of days) {
    for (const { id, capacity } of types) {
      // Upsert per (roomTypeId, date)
      await prisma.roomAvailability.upsert({
        where: {
          roomTypeId_date: { roomTypeId: id, date },  // assumes a compound unique
        },
        create: {
          roomTypeId: id,
          date,
          remaining: capacity,
        },
        update: {
          remaining: capacity,
        },
      })
    }
  }
  console.log('✅ Seeded room types and availability')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
