import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';

type ExerciseHistorySet = {
  weight: number;
  reps: number;
  performedAt: Date;
};

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateEstimated1RM(weight: number, reps: number) {
    return Number((weight * (1 + reps / 30)).toFixed(2));
  }

  async findAll() {
    return this.prisma.exercise.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(createExerciseDto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: createExerciseDto,
    });
  }

  async findHistory(id: string) {
    const sets = await this.prisma.exerciseSet.findMany({
      where: { exerciseId: id },
      select: {
        weight: true,
        reps: true,
        session: {
          select: {
            performedAt: true,
          },
        },
      },
      orderBy: [
        {
          session: {
            performedAt: 'asc',
          },
        },
        {
          setOrder: 'asc',
        },
      ],
    });

    return sets.map((set) => this.toHistoryPoint({
      weight: set.weight,
      reps: set.reps,
      performedAt: set.session.performedAt,
    }));
  }

  async findStagnation(id: string) {
    const sets = await this.prisma.exerciseSet.findMany({
      where: { exerciseId: id },
      select: {
        sessionId: true,
        weight: true,
        reps: true,
        session: {
          select: {
            performedAt: true,
          },
        },
      },
      orderBy: [
        {
          session: {
            performedAt: 'asc',
          },
        },
        {
          setOrder: 'asc',
        },
      ],
    });

    const sessions = new Map<
      string,
      { performedAt: Date; maxWeight: number; maxReps: number; maxEstimated1RM: number }
    >();

    for (const set of sets) {
      const estimated1RM = this.calculateEstimated1RM(set.weight, set.reps);
      const existingSession = sessions.get(set.sessionId);

      if (!existingSession) {
        sessions.set(set.sessionId, {
          performedAt: set.session.performedAt,
          maxWeight: set.weight,
          maxReps: set.reps,
          maxEstimated1RM: estimated1RM,
        });
        continue;
      }

      existingSession.maxWeight = Math.max(existingSession.maxWeight, set.weight);
      existingSession.maxReps = Math.max(existingSession.maxReps, set.reps);
      existingSession.maxEstimated1RM = Math.max(existingSession.maxEstimated1RM, estimated1RM);
    }

    const recentSessions = Array.from(sessions.values()).slice(-5);

    if (recentSessions.length < 3) {
      return {
        stagnating: false,
        explanation: 'Not enough session data yet. At least 3 sessions are needed for stagnation detection.',
      };
    }

    const baseline = recentSessions[0];
    const hasImprovement = recentSessions.slice(1).some((session) => (
      session.maxWeight > baseline.maxWeight ||
      session.maxReps > baseline.maxReps ||
      session.maxEstimated1RM > baseline.maxEstimated1RM
    ));

    if (!hasImprovement) {
      return {
        stagnating: true,
        explanation: `No improvement in weight, reps, or estimated 1RM across the last ${recentSessions.length} sessions.`,
      };
    }

    return {
      stagnating: false,
      explanation: `Progress is still visible within the last ${recentSessions.length} sessions.`,
    };
  }

  private toHistoryPoint(set: ExerciseHistorySet) {
    const estimated1RM = this.calculateEstimated1RM(set.weight, set.reps);
    const volume = set.weight * set.reps;

    return {
      weight: set.weight,
      reps: set.reps,
      estimated1RM,
      volume,
      performedAt: set.performedAt,
    };
  }
}
