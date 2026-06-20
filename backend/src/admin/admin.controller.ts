import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminCreateScholarshipDto, AdminUpdateScholarshipDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('scholarships')
  async create(@Body() dto: AdminCreateScholarshipDto) {
    return this.adminService.createScholarship(dto);
  }

  @Patch('scholarships/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: AdminUpdateScholarshipDto,
  ) {
    return this.adminService.updateScholarship(id, dto);
  }

  @Delete('scholarships/:id')
  async delete(@Param('id') id: string) {
    return this.adminService.deleteScholarship(id);
  }

  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }
}
