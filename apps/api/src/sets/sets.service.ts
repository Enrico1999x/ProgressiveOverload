import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseSetDto } from './dto/create-exercise-set.dto';

@Injectable()
export class SetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExerciseSetDto: CreateExerciseSetDto) {
    return this.prisma.exerciseSet.create({
      data: createExerciseSetDto,
    });
  }

  async findBySessionId(sessionId: string) {
    return this.prisma.exerciseSet.findMany({
      where: { sessionId },
      orderBy: [
        { setOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  }
}
