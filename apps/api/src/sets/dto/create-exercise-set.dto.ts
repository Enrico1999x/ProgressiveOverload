import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateExerciseSetDto {
  @IsUUID()
  sessionId: string;

  @IsUUID()
  exerciseId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  setOrder: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  reps: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rir?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rpe?: number;
}
