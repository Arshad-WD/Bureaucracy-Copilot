import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AdminCreateScholarshipDto, AdminUpdateScholarshipDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createScholarship(dto: AdminCreateScholarshipDto) {
    const deadlineDate = dto.deadline ? new Date(dto.deadline) : null;
    const ruleObj = dto.rules || {};

    const scholarship = await this.prisma.$transaction(async (tx) => {
      // 1. Create Scholarship record
      const s = await tx.scholarship.create({
        data: {
          title: dto.title,
          description: dto.description,
          provider: dto.provider,
          amount: dto.amount,
          applicationUrl: dto.applicationUrl,
          deadline: deadlineDate,
          status: dto.status || 'ACTIVE',
        },
      });

      // 2. Create rule parameters
      await tx.eligibilityRule.create({
        data: {
          scholarshipId: s.id,
          ruleJson: ruleObj,
        },
      });

      // 3. Create document checklists
      if (dto.documents && dto.documents.length > 0) {
        await tx.requiredDocument.createMany({
          data: dto.documents.map((d) => ({
            scholarshipId: s.id,
            documentName: d.documentName,
            mandatory: d.mandatory !== false,
          })),
        });
      }

      // 4. Generate embeddings mock chunk for RAG index
      const chunkText = `Scholarship: ${s.title}
Amount: ₹${s.amount}
Provider: ${s.provider}
Description: ${s.description}
Eligibility Rules: ${JSON.stringify(ruleObj)}`;

      await tx.scholarshipEmbedding.create({
        data: {
          scholarshipId: s.id,
          chunkText,
          embeddingJson: JSON.stringify(Array(1536).fill(0)), // Mock empty embedding
        },
      });

      return s;
    });

    return {
      success: true,
      message: 'Scholarship created successfully',
      data: scholarship,
    };
  }

  async updateScholarship(id: string, dto: AdminUpdateScholarshipDto) {
    const exists = await this.prisma.scholarship.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFoundException('Scholarship not found');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const deadlineVal = dto.deadline ? new Date(dto.deadline) : undefined;

      // 1. Update Core details
      const s = await tx.scholarship.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          provider: dto.provider,
          amount: dto.amount,
          applicationUrl: dto.applicationUrl,
          deadline: deadlineVal,
          status: dto.status,
        },
      });

      // 2. Update rules if provided
      if (dto.rules !== undefined) {
        // Delete old and write new
        await tx.eligibilityRule.deleteMany({
          where: { scholarshipId: id },
        });
        await tx.eligibilityRule.create({
          data: {
            scholarshipId: id,
            ruleJson: dto.rules,
          },
        });
      }

      // 3. Update documents if provided
      if (dto.documents !== undefined) {
        await tx.requiredDocument.deleteMany({
          where: { scholarshipId: id },
        });
        if (dto.documents.length > 0) {
          await tx.requiredDocument.createMany({
            data: dto.documents.map((d) => ({
              scholarshipId: id,
              documentName: d.documentName,
              mandatory: d.mandatory !== false,
            })),
          });
        }
      }

      return s;
    });

    return {
      success: true,
      message: 'Scholarship updated successfully',
      data: updated,
    };
  }

  async deleteScholarship(id: string) {
    const exists = await this.prisma.scholarship.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFoundException('Scholarship not found');
    }

    await this.prisma.scholarship.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Scholarship deleted successfully',
    };
  }

  async getAnalytics() {
    const [totalUsers, totalScholarships, savedScholarships, activeApplications] = await Promise.all([
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.scholarship.count(),
      this.prisma.savedScholarship.count(),
      this.prisma.application.count(),
    ]);

    // Mock interactive metrics for dashboards
    const eligibilityChecks = totalUsers * 4 + 12;

    return {
      totalUsers,
      totalScholarships,
      eligibilityChecks,
      savedScholarships,
      activeApplications,
    };
  }
}
