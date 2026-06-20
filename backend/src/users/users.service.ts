import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updated = await this.prisma.userProfile.upsert({
      where: { userId },
      update: {
        age: dto.age,
        gender: dto.gender,
        state: dto.state,
        educationLevel: dto.educationLevel,
        institutionType: dto.institutionType,
        annualIncome: dto.annualIncome,
        category: dto.category,
        disability: dto.disability,
      },
      create: {
        userId,
        age: dto.age,
        gender: dto.gender,
        state: dto.state,
        educationLevel: dto.educationLevel,
        institutionType: dto.institutionType,
        annualIncome: dto.annualIncome,
        category: dto.category,
        disability: dto.disability || false,
      },
    });

    return {
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    };
  }
}
