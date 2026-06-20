import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatDto, ExplainDto } from './dto/ai.dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private prisma: PrismaService) { }

  async chat(dto: ChatDto, userId?: string) {
    let context = '';
    let scholarshipTitle = '';

    // Step 1: Retrieve context
    if (dto.scholarshipId) {
      const scholarship = await this.prisma.scholarship.findUnique({
        where: { id: dto.scholarshipId },
        include: { documents: true, rules: true },
      });
      if (scholarship) {
        scholarshipTitle = scholarship.title;
        context = this.buildScholarshipContext(scholarship);
      }
    } else {
      // Find matching scholarship context by scanning keywords in message
      const cleanMessage = dto.message.toLowerCase().replace(/[^\w\s]/g, ' ');
      const keywords = cleanMessage
        .split(/\s+/)
        .filter(word => word.length > 2);

      let scholarships: any[] = [];
      if (keywords.length > 0) {
        scholarships = await this.prisma.scholarship.findMany({
          where: {
            status: 'ACTIVE',
            OR: keywords.flatMap(word => [
              { title: { contains: word } },
              { description: { contains: word } },
            ]),
          },
          include: { documents: true, rules: true },
          take: 3,
        });
      }

      // Fallback if no matching scholarship found by keyword search
      if (scholarships.length === 0) {
        scholarships = await this.prisma.scholarship.findMany({
          where: { status: 'ACTIVE' },
          include: { documents: true, rules: true },
          take: 3,
        });
      }

      context = scholarships.map(s => this.buildScholarshipContext(s)).join('\n\n');
      if (scholarships.length > 0) {
        scholarshipTitle = scholarships[0].title;
      }
    }

    const systemPrompt = `You are Bureaucracy Copilot, an expert AI assistant helping Indian students with welfare schemes and scholarships.
Answer the user's question using ONLY the provided verified scholarship database context.

Rules:
1. Never invent scholarship details (amounts, deadlines, rules).
2. If the context does not contain the answer, say exactly: "I could not find this information in the scholarship database."
3. Cite the source scholarship name.
4. Never guarantee eligibility or approval.
5. Provide response in clear markdown format.
6. Keep your answers direct and brief.

Verified Context:
${context || 'No specific scholarship details retrieved.'}
`;

    // Step 2: Query LLM or fallback
    const geminiKey = process.env.GEMINI_API_KEY;
    const nvidiaKey = process.env.NVIDIA_API_KEY;

    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await this.withTimeout(
          model.generateContent([
            { text: systemPrompt },
            { text: `Question: ${dto.message}` },
          ]),
          4000
        );
        return { answer: result.response.text() };
      } catch (err: any) {
        this.logger.error('Gemini API Error, falling back: ' + err.message);
      }
    }

    if (nvidiaKey) {
      try {
        const fetchPromise = fetch(
          'https://integrate.api.nvidia.com/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${nvidiaKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: dto.message },
              ],
              temperature: 0.2,
              max_tokens: 1024,
            }),
          }
        );
        const response = await this.withTimeout(fetchPromise, 4000);
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        return { answer: data.choices[0].message.content };
      } catch (err: any) {
        this.logger.error('NVIDIA NIM API Error, falling back: ' + err.message);
      }
    }

    // High quality offline fallback
    return {
      answer: this.generateOfflineAnswer(dto.message, context, scholarshipTitle),
    };
  }

  async explain(dto: ExplainDto) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id: dto.scholarshipId },
      include: { documents: true, rules: true },
    });

    if (!scholarship) {
      return { summary: 'Scholarship details not found in the database.' };
    }

    const context = this.buildScholarshipContext(scholarship);
    const message = `Provide a comprehensive summary of this scholarship, explaining who can apply, the benefits, and steps to complete.`;

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await this.withTimeout(
          model.generateContent([
            { text: `Summarize the following scholarship:\n${context}` },
          ]),
          4000
        );
        return { summary: result.response.text() };
      } catch { }
    }

    // Default high-quality structured summary
    const deadlineStr = scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'Not Specified';
    const docs = scholarship.documents.map(d => `- ${d.documentName} (${d.mandatory ? 'Mandatory' : 'Optional'})`).join('\n');
    let rulesDesc = 'Open to all applicants.';
    if (scholarship.rules.length > 0) {
      const r = scholarship.rules[0].ruleJson as any;
      rulesDesc = `
- **Income limit**: Less than ₹${r.income?.max || '8,00,000'} per annum.
- **States**: ${r.state ? r.state.join(', ') : 'All States'}
- **Education**: ${r.educationLevel ? r.educationLevel.join(', ') : 'All levels'}
- **Categories**: ${r.category ? r.category.join(', ') : 'All categories'}
      `;
    }

    const summary = `
### ${scholarship.title}
*Provided by ${scholarship.provider}*

**Financial Benefit:** ₹${scholarship.amount.toLocaleString()}
**Application Deadline:** ${deadlineStr}

#### Overview
${scholarship.description}

#### Eligibility Criteria
${rulesDesc}

#### Required Documents
${docs || 'No documents specified.'}

---
*Verify all criteria on the official site before submitting. Sources are cited directly from database reference.*
`;

    return { summary };
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      ),
    ]);
  }

  private buildScholarshipContext(s: any): string {
    const deadline = s.deadline ? new Date(s.deadline).toLocaleDateString() : 'N/A';
    const docs = s.documents.map((d: any) => `- ${d.documentName} (${d.mandatory ? 'Mandatory' : 'Optional'})`).join('\n');
    const rules = s.rules[0]?.ruleJson ? JSON.stringify(s.rules[0].ruleJson) : 'None';

    return `Scholarship: ${s.title}
Provider: ${s.provider}
Amount: ₹${s.amount}
Deadline: ${deadline}
Application Link: ${s.applicationUrl || 'N/A'}
Description: ${s.description}
Eligibility Rules (JSON): ${rules}
Required Documents:
${docs}`;
  }

  private generateOfflineAnswer(query: string, context: string, title: string): string {
    const qLower = query.toLowerCase();

    if (qLower.includes('document') || qLower.includes('paper') || qLower.includes('upload')) {
      if (context.includes('Required Documents:')) {
        const section = context.substring(context.indexOf('Required Documents:'));
        return `Based on database records, here are the required documents for **${title || 'the scholarship'}**:\n\n${section.replace('Required Documents:', '').trim()}\n\n*Source: Verified Scholarship database.*`;
      }
    }

    if (qLower.includes('eligible') || qLower.includes('qualify') || qLower.includes('income') || qLower.includes('who can')) {
      if (context.includes('Eligibility Rules (JSON):')) {
        const start = context.indexOf('EligibilityRules') || context.indexOf('Eligibility Rules (JSON):');
        const end = context.indexOf('Required Documents');
        const rulesStr = context.substring(start, end).trim();
        return `Based on database criteria, the eligibility parameters for **${title || 'the scholarship'}** are defined as:\n\n${rulesStr}\n\n*Please complete your profile details to evaluate matching status.*`;
      }
    }

    if (context) {
      return `### Information for ${title || 'Scholarships'}

${context.split('\n').slice(0, 8).join('\n')}

*For more custom conversational answers, configure the GEMINI_API_KEY in the environment file.*`;
    }

    return `I could not find this information in the scholarship database.`;
  }
}
