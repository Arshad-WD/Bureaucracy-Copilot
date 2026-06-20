import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CheckEligibilityDto } from './dto/eligibility.dto';

@Injectable()
export class EligibilityService {
  constructor(private prisma: PrismaService) {}

  async checkEligibility(dto: CheckEligibilityDto) {
    const scholarships = await this.prisma.scholarship.findMany({
      where: { status: 'ACTIVE' },
      include: {
        rules: true,
      },
    });

    const matches = scholarships.map((s) => {
      const evaluation = this.evaluateRules(dto, s.rules[0]?.ruleJson);
      return {
        scholarshipId: s.id,
        title: s.title,
        score: evaluation.score,
        reasons: evaluation.reasons,
      };
    });

    // Sort by match score descending
    matches.sort((a, b) => b.score - a.score);

    return { matches };
  }

  async checkSavedProfileEligibility(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found. Please complete profile setup first.');
    }

    const checkDto: CheckEligibilityDto = {
      state: profile.state || undefined,
      annualIncome: profile.annualIncome || undefined,
      educationLevel: profile.educationLevel || undefined,
      category: profile.category || undefined,
      disability: profile.disability || false,
    };

    return this.checkEligibility(checkDto);
  }

  private evaluateRules(profile: CheckEligibilityDto, ruleJson: any): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // Weights configuration based on ERED spec
    const weights = {
      education: 30,
      income: 25,
      state: 20,
      category: 15,
      disability: 10,
    };

    if (!ruleJson) {
      // If no rules defined, it's 100% match
      return {
        score: 100,
        reasons: ['No specific eligibility rules specified (open to all).'],
      };
    }

    let rules: any = {};
    if (typeof ruleJson === 'string') {
      try {
        rules = JSON.parse(ruleJson);
      } catch {
        rules = {};
      }
    } else {
      rules = ruleJson;
    }

    // 1. Education Level Check
    const allowedEd = rules.educationLevel || rules.education;
    if (allowedEd) {
      const userEd = profile.educationLevel;
      if (userEd && this.matchRuleValue(allowedEd, userEd)) {
        score += weights.education;
        reasons.push('Education criteria satisfied');
      } else {
        reasons.push('Education requirement not satisfied');
      }
    } else {
      // Open
      score += weights.education;
    }

    // 2. Income Check
    const incomeLimit = rules.income;
    if (incomeLimit) {
      const userIncome = profile.annualIncome;
      let matched = true;
      if (userIncome !== undefined) {
        if (incomeLimit.max !== undefined && userIncome > incomeLimit.max) {
          matched = false;
        }
        if (incomeLimit.min !== undefined && userIncome < incomeLimit.min) {
          matched = false;
        }
      } else {
        matched = false; // missing required income info
      }

      if (matched) {
        score += weights.income;
        reasons.push('Income criteria satisfied');
      } else {
        reasons.push('Income requirement not satisfied');
      }
    } else {
      // Open
      score += weights.income;
    }

    // 3. State Check
    const allowedStates = rules.state;
    if (allowedStates) {
      const userState = profile.state;
      if (userState && this.matchRuleValue(allowedStates, userState)) {
        score += weights.state;
        reasons.push('State criteria satisfied');
      } else {
        reasons.push('State requirement not satisfied');
      }
    } else {
      // Open
      score += weights.state;
    }

    // 4. Category Check
    const allowedCategories = rules.category;
    if (allowedCategories) {
      const userCat = profile.category;
      if (userCat && this.matchRuleValue(allowedCategories, userCat)) {
        score += weights.category;
        reasons.push('Category criteria satisfied');
      } else {
        reasons.push('Category requirement not satisfied');
      }
    } else {
      // Open
      score += weights.category;
    }

    // 5. Disability Check
    const disabilityReq = rules.disability;
    if (disabilityReq !== undefined) {
      const userDis = !!profile.disability;
      if (disabilityReq === userDis) {
        score += weights.disability;
        reasons.push('Disability criteria satisfied');
      } else {
        reasons.push('Disability requirement not satisfied');
      }
    } else {
      // Open
      score += weights.disability;
    }

    return {
      score,
      reasons,
    };
  }

  private matchRuleValue(ruleVal: any, userVal: string): boolean {
    const userValLower = userVal.trim().toLowerCase();
    if (Array.isArray(ruleVal)) {
      return ruleVal.some((v) => String(v).trim().toLowerCase() === userValLower);
    }
    return String(ruleVal).trim().toLowerCase() === userValLower;
  }
}
