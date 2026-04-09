import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'enrico@example.com' },
    update: {},
    create: {
      email: 'enrico@example.com',
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        userId: user.id,
        name: 'Bench Press',
        muscleGroup: 'Chest',
        notes: 'Pause briefly on chest',
      },
      {
        userId: user.id,
        name: 'Squat',
        muscleGroup: 'Legs',
        notes: 'Focus on depth and bracing',
      },
      {
        userId: user.id,
        name: 'Lat Pulldown',
        muscleGroup: 'Back',
        notes: 'Control the eccentric',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
