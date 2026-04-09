import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateExerciseSetDto } from './dto/create-exercise-set.dto';
import { SetsService } from './sets.service';

@Controller()
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Post('sets')
  create(@Body() createExerciseSetDto: CreateExerciseSetDto) {
    return this.setsService.create(createExerciseSetDto);
  }

  @Get('sessions/:id/sets')
  findBySessionId(@Param('id', ParseUUIDPipe) id: string) {
    return this.setsService.findBySessionId(id);
  }
}
