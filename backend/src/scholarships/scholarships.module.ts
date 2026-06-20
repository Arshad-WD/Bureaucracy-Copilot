import { Module } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { ScholarshipsController } from './scholarships.controller';
import { SavedScholarshipsController } from './saved-scholarships.controller';
import { ApplicationsController } from './applications.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [
    ScholarshipsController,
    SavedScholarshipsController,
    ApplicationsController,
  ],
  providers: [ScholarshipsService, PrismaService],
  exports: [ScholarshipsService],
})
export class ScholarshipsModule {}
