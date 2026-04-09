import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkoutSessionDto: CreateWorkoutSessionDto) {
    return this.prisma.workoutSession.create({
      data: {
        ...createWorkoutSessionDto,
        performedAt: new Date(createWorkoutSessionDto.performedAt),
      },
    });
  }

  async findAll() {
    return this.prisma.workoutSession.findMany({
      orderBy: [
        { performedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException(`Workout session with id "${id}" not found`);
    }

    return session;
  }
}
