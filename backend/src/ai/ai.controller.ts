import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatDto, ExplainDto } from './dto/ai.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(
    @GetUser('id') userId: string,
    @Body() dto: ChatDto,
  ) {
    return this.aiService.chat(dto, userId);
  }

  @Post('explain')
  async explain(@Body() dto: ExplainDto) {
    return this.aiService.explain(dto);
  }
}
