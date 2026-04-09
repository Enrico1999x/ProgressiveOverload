import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ExercisesModule } from './exercises/exercises.module';
import { SessionsModule } from './sessions/sessions.module';
import { SetsModule } from './sets/sets.module';

@Module({
  imports: [PrismaModule, ExercisesModule, SessionsModule, SetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
