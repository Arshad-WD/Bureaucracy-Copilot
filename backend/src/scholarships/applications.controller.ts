import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { CreateApplicationDto, UpdateApplicationDto } from './dto/scholarship.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private scholarshipsService: ScholarshipsService) {}

  @Post()
  async create(
    @GetUser('id') userId: string,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.scholarshipsService.createApplication(userId, dto);
  }

  @Patch(':id')
  async update(
    @GetUser('id') userId: string,
    @Param('id') applicationId: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.scholarshipsService.updateApplication(userId, applicationId, dto);
  }

  @Get()
  async getApplications(@GetUser('id') userId: string) {
    return this.scholarshipsService.getApplications(userId);
  }
}
