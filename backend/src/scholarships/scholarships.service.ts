import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SearchScholarshipDto, SaveScholarshipDto, CreateApplicationDto, UpdateApplicationDto } from './dto/scholarship.dto';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class ScholarshipsService {
  constructor(private prisma: PrismaService) {}

  private isSQLite(): boolean {
    try {
      const schemaPath = path.join(__dirname, '../../prisma/schema.prisma');
      if (fs.existsSync(schemaPath)) {
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');
        return schemaContent.includes('provider = "sqlite"') || schemaContent.includes('provider="sqlite"');
      }
    } catch (e) {
      // fallback
    }
    return false;
  }

  private buildStringFilter(value: string) {
    if (this.isSQLite()) {
      return { contains: value };
    }
    return { contains: value, mode: 'insensitive' as any };
  }


  async findAll(query: {
    page?: number;
    limit?: number;
    state?: string;
    education?: string;
    category?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = { status: 'ACTIVE' };

    if (query.state) {
      where.OR = [
        { rules: { some: { ruleJson: { path: ['state'], equals: query.state } } } },
        { rules: { some: { ruleJson: { path: ['state'], array_contains: query.state } } } },
        { provider: this.buildStringFilter(query.state) },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.scholarship.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          documents: true,
          rules: true,
        },
      }),
      this.prisma.scholarship.count({ where }),
    ]);

    return {
      data,
      total,
    };
  }

  async findOne(id: string) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id },
      include: {
        documents: true,
        rules: true,
      },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    return scholarship;
  }

  async search(dto: SearchScholarshipDto) {
    const where: any = { status: 'ACTIVE' };

    if (dto.keyword) {
      where.OR = [
        { title: this.buildStringFilter(dto.keyword) },
        { description: this.buildStringFilter(dto.keyword) },
        { provider: this.buildStringFilter(dto.keyword) },
      ];
    }

    if (dto.state) {
      where.OR = [
        ...(where.OR || []),
        { provider: this.buildStringFilter(dto.state) },
      ];
    }

    const results = await this.prisma.scholarship.findMany({
      where,
      include: {
        documents: true,
        rules: true,
      },
    });

    return { results };
  }

  // --- Saved Scholarships ---

  async saveScholarship(userId: string, scholarshipId: string) {
    const exists = await this.prisma.scholarship.findUnique({
      where: { id: scholarshipId },
    });
    if (!exists) {
      throw new NotFoundException('Scholarship not found');
    }

    // Upsert or create to prevent duplicates
    await this.prisma.savedScholarship.upsert({
      where: {
        userId_scholarshipId: {
          userId,
          scholarshipId,
        },
      },
      update: {},
      create: {
        userId,
        scholarshipId,
      },
    });

    return { success: true };
  }

  async getSavedScholarships(userId: string) {
    const saved = await this.prisma.savedScholarship.findMany({
      where: { userId },
      include: {
        scholarship: {
          include: {
            documents: true,
            rules: true,
          },
        },
      },
      orderBy: { savedAt: 'desc' },
    });

    return {
      data: saved.map((s) => ({
        ...s.scholarship,
        id: s.id,
        savedAt: s.savedAt,
        scholarshipId: s.scholarshipId,
      })),
    };
  }

  async removeSavedScholarship(userId: string, targetId: string) {
    // TargetId could be the saved scholarship record ID OR the scholarship ID itself
    const record = await this.prisma.savedScholarship.findFirst({
      where: {
        userId,
        OR: [
          { id: targetId },
          { scholarshipId: targetId },
        ],
      },
    });

    if (!record) {
      throw new NotFoundException('Saved scholarship not found');
    }

    await this.prisma.savedScholarship.delete({
      where: { id: record.id },
    });

    return { success: true };
  }

  // --- Application Tracking ---

  async createApplication(userId: string, dto: CreateApplicationDto) {
    const exists = await this.prisma.scholarship.findUnique({
      where: { id: dto.scholarshipId },
    });
    if (!exists) {
      throw new NotFoundException('Scholarship not found');
    }

    // Check if application already exists
    const existingApp = await this.prisma.application.findFirst({
      where: {
        userId,
        scholarshipId: dto.scholarshipId,
      },
    });

    if (existingApp) {
      // Update status if it exists
      await this.prisma.application.update({
        where: { id: existingApp.id },
        data: { status: dto.status },
      });
    } else {
      await this.prisma.application.create({
        data: {
          userId,
          scholarshipId: dto.scholarshipId,
          status: dto.status,
        },
      });
    }

    return { success: true };
  }

  async updateApplication(userId: string, applicationId: string, dto: UpdateApplicationDto) {
    const app = await this.prisma.application.findFirst({
      where: {
        id: applicationId,
        userId,
      },
    });

    if (!app) {
      throw new NotFoundException('Application not found');
    }

    await this.prisma.application.update({
      where: { id: applicationId },
      data: { status: dto.status },
    });

    return { success: true };
  }

  async getApplications(userId: string) {
    const applications = await this.prisma.application.findMany({
      where: { userId },
      include: {
        scholarship: true,
      },
      orderBy: { appliedAt: 'desc' },
    });

    return { applications };
  }
}
