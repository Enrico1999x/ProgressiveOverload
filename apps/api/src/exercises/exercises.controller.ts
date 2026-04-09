import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  findAll() {
    return this.exercisesService.findAll();
  }

  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  @Get(':id/history')
  findHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.exercisesService.findHistory(id);
  }

  @Get(':id/stagnation')
  findStagnation(@Param('id', ParseUUIDPipe) id: string) {
    return this.exercisesService.findStagnation(id);
  }
}
