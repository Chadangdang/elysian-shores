// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const { eachDayOfInterval } = require('date-fns');

const prisma = new PrismaClient();

async function main() {
  // 1) Upsert room types
  const types = [
    { id: 'room_1', name: 'Classic Room',   capacity: 20 },
    { id: 'room_2', name: 'Deluxe Suite',    capacity: 10 },
    { id: 'room_3', name: 'Executive Suite', capacity: 5  },
  ];
  for (const { id, name, capacity } of types) {
    await prisma.roomType.upsert({
      where: { id },
      create: { id, name, capacity },
      update: { name, capacity },
    });
  }

  // 2) Seed availability May 12 → July 30, 2025
  const start = new Date(2025, 4, 12);  // May is month 4
  const end   = new Date(2025, 6, 30);  // July is month 6
  const days  = eachDayOfInterval({ start, end });

  for (const date of days) {
    for (const { id, capacity } of types) {
      await prisma.roomAvailability.upsert({
        where: {
          roomTypeId_date: { roomTypeId: id, date },
        },
        create: {
          roomTypeId: id,
          date,
          remaining: capacity,
        },
        update: {
          remaining: capacity,
        },
      });
    }
  }

  console.log('✅ Seeded room types and availability');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
