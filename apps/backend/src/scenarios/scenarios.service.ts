/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient, ScenarioRun } from '@prisma/client';
import { RunScenarioDto } from './dto/run-scenario.dto';

@Injectable()
export class ScenariosService {
  private readonly prisma = new PrismaClient();

  async runScenario(input: RunScenarioDto): Promise<ScenarioRun> {
    const startedAt = Date.now();
    let metadata: Record<string, unknown> = {};

    try {
      switch (input.type) {
        case 'success':
          metadata = { name: input.name ?? null };
          break;
        case 'slow_request': {
          const delayMs = this.randomDelayMs();
          metadata = { name: input.name ?? null, delayMs };
          await this.delay(delayMs);
          break;
        }
        case 'validation_error':
          throw new BadRequestException('Simulated validation error');
        case 'system_error':
          throw new Error('Simulated system error');
      }

      return await this.prisma.scenarioRun.create({
        data: {
          type: input.type,
          status: 'success',
          duration: Date.now() - startedAt,
          metadata,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      await this.prisma.scenarioRun.create({
        data: {
          type: input.type,
          status: input.type,
          duration: Date.now() - startedAt,
          error: message,
          metadata: { name: input.name ?? null },
        },
      });

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Simulated system error');
    }
  }

  listRecentRuns(limit = 20): Promise<ScenarioRun[]> {
    return this.prisma.scenarioRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  private randomDelayMs(): number {
    const min = 2000;
    const max = 5000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
