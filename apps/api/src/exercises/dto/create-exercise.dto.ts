import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateExerciseDto {
  @IsUUID()
  userId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  muscleGroup: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
