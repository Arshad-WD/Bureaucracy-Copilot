import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { SearchScholarshipDto } from './dto/scholarship.dto';

@Controller('scholarships')
export class ScholarshipsController {
  constructor(private scholarshipsService: ScholarshipsService) {}

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('state') state?: string,
    @Query('education') education?: string,
    @Query('category') category?: string,
  ) {
    return this.scholarshipsService.findAll({
      page,
      limit,
      state,
      education,
      category,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.scholarshipsService.findOne(id);
  }

  @Post('search')
  @HttpCode(200)
  async search(@Body() dto: SearchScholarshipDto) {
    return this.scholarshipsService.search(dto);
  }
}
