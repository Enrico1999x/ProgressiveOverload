import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

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

  const trainingCycleName = 'Starter Push Pull Legs';
  let trainingCycle = await prisma.trainingCycle.findFirst({
    where: {
      userId: user.id,
      name: trainingCycleName,
    },
  });

  if (!trainingCycle) {
    trainingCycle = await prisma.trainingCycle.create({
      data: {
        userId: user.id,
        name: trainingCycleName,
        intervalLengthDays: 7,
        isActive: true,
      },
    });
  }

  const workoutDayTemplateName = 'Push Day';
  let workoutDayTemplate = await prisma.workoutDayTemplate.findFirst({
    where: {
      cycleId: trainingCycle.id,
      name: workoutDayTemplateName,
    },
  });

  if (!workoutDayTemplate) {
    workoutDayTemplate = await prisma.workoutDayTemplate.create({
      data: {
        cycleId: trainingCycle.id,
        name: workoutDayTemplateName,
        orderIndex: 1,
      },
    });
  }

  const exerciseSeeds = [
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
  ];

  for (const exerciseSeed of exerciseSeeds) {
    const existingExercise = await prisma.exercise.findFirst({
      where: {
        userId: exerciseSeed.userId,
        name: exerciseSeed.name,
      },
    });

    if (!existingExercise) {
      await prisma.exercise.create({
        data: exerciseSeed,
      });
    }
  }

  console.log('Seeded IDs:');
  console.log(`userId: ${user.id}`);
  console.log(`cycleId: ${trainingCycle.id}`);
  console.log(`workoutDayTemplateId: ${workoutDayTemplate.id}`);
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
