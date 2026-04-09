import { IsDateString, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateWorkoutSessionDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  cycleId: string;

  @IsUUID()
  workoutDayTemplateId: string;

  @IsDateString()
  performedAt: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
