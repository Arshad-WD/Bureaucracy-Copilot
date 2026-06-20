import { Module } from '@nestjs/common';
import { EligibilityService } from './eligibility.service';
import { EligibilityController } from './eligibility.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [EligibilityController],
  providers: [EligibilityService, PrismaService],
  exports: [EligibilityService],
})
export class EligibilityModule {}
