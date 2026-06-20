import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { SaveScholarshipDto } from './dto/scholarship.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('saved-scholarships')
@UseGuards(JwtAuthGuard)
export class SavedScholarshipsController {
  constructor(private scholarshipsService: ScholarshipsService) {}

  @Post()
  async save(
    @GetUser('id') userId: string,
    @Body() dto: SaveScholarshipDto,
  ) {
    return this.scholarshipsService.saveScholarship(userId, dto.scholarshipId);
  }

  @Get()
  async getSaved(@GetUser('id') userId: string) {
    return this.scholarshipsService.getSavedScholarships(userId);
  }

  @Delete(':id')
  async remove(
    @GetUser('id') userId: string,
    @Param('id') targetId: string,
  ) {
    return this.scholarshipsService.removeSavedScholarship(userId, targetId);
  }
}
