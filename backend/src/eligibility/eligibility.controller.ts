import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { EligibilityService } from './eligibility.service';
import { CheckEligibilityDto } from './dto/eligibility.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('eligibility')
export class EligibilityController {
  constructor(private eligibilityService: EligibilityService) {}

  @Post('check')
  async check(@Body() dto: CheckEligibilityDto) {
    return this.eligibilityService.checkEligibility(dto);
  }

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  async getRecommendations(@GetUser('id') userId: string) {
    return this.eligibilityService.checkSavedProfileEligibility(userId);
  }
}
