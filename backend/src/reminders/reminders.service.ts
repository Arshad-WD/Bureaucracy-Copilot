import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RemindersService implements OnModuleInit {
  private readonly logger = new Logger(RemindersService.name);

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    // Run initial check and then run every hour
    this.runCheck();
    setInterval(() => this.runCheck(), 60 * 60 * 1000);
  }

  async runCheck() {
    this.logger.log('Starting automated deadline check...');
    try {
      const now = new Date();
      // Fetch saved scholarships with deadlines
      const saved = await this.prisma.savedScholarship.findMany({
        include: {
          scholarship: true,
          user: true,
        },
      });

      for (const item of saved) {
        const deadline = item.scholarship.deadline;
        if (!deadline) continue;

        const diffTime = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) continue; // expired

        // Define target reminder brackets
        const brackets = [
          { days: 30, type: '30_DAY', label: '30 days' },
          { days: 14, type: '14_DAY', label: '14 days' },
          { days: 7, type: '7_DAY', label: '7 days' },
          { days: 1, type: '1_DAY', label: '1 day' },
        ];

        for (const bracket of brackets) {
          if (diffDays <= bracket.days) {
            // Check if reminder was already sent for this bracket
            const sentExists = await this.prisma.reminder.findFirst({
              where: {
                userId: item.userId,
                scholarshipId: item.scholarshipId,
                reminderType: bracket.type,
              },
            });

            if (!sentExists) {
              await this.prisma.$transaction([
                // Log in reminders history table
                this.prisma.reminder.create({
                  data: {
                    userId: item.userId,
                    scholarshipId: item.scholarshipId,
                    reminderType: bracket.type,
                    scheduledAt: now,
                    sent: true,
                  },
                }),
                // Inject an in-app notification
                this.prisma.notification.create({
                  data: {
                    userId: item.userId,
                    title: 'Scholarship Deadline Approaching!',
                    message: `The deadline for "${item.scholarship.title}" is in ${bracket.label} (${deadline.toLocaleDateString()}). Make sure to apply!`,
                  },
                }),
              ]);
              this.logger.log(`Sent ${bracket.type} reminder to user ${item.user.email} for "${item.scholarship.title}"`);
            }
          }
        }
      }
    } catch (err: any) {
      this.logger.error('Failed to process deadline checks: ' + err.message);
    }
  }

  async getRemindersForUser(userId: string) {
    const list = await this.prisma.reminder.findMany({
      where: { userId },
      include: {
        scholarship: true,
      },
      orderBy: { scheduledAt: 'desc' },
    });
    return { data: list };
  }
}
