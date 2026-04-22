/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { PrismaClient } from '@prisma/client';
import { ObservabilityService } from '../observability/observability.service';
import { RunScenarioDto } from './dto/run-scenario.dto';

type ScenarioRunRecord = {
  id: string;
  type: string;
  status: string;
  duration: number | null;
  error: string | null;
  metadata: unknown;
  createdAt: Date;
};

@Injectable()
export class ScenariosService {
  private readonly prisma = new PrismaClient();
  constructor(private readonly observabilityService: ObservabilityService) {}

  async runScenario(input: RunScenarioDto): Promise<ScenarioRunRecord> {
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

      const run = (await this.prisma.scenarioRun.create({
        data: {
          type: input.type,
          status: 'success',
          duration: Date.now() - startedAt,
          metadata,
        },
      })) as ScenarioRunRecord;
      this.observeAndLogRun(run);
      return run;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      if (input.type === 'validation_error') {
        Sentry.addBreadcrumb({
          category: 'scenario',
          level: 'warning',
          message: 'Simulated validation error triggered',
          data: { scenarioType: input.type, name: input.name ?? null },
        });
      }

      if (input.type === 'system_error') {
        Sentry.captureException(error);
      }

      const run = (await this.prisma.scenarioRun.create({
        data: {
          type: input.type,
          status: input.type,
          duration: Date.now() - startedAt,
          error: message,
          metadata: { name: input.name ?? null },
        },
      })) as ScenarioRunRecord;
      this.observeAndLogRun(run);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Simulated system error');
    }
  }

  listRecentRuns(limit = 20): Promise<ScenarioRunRecord[]> {
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

  private observeAndLogRun(run: ScenarioRunRecord): void {
    this.observabilityService.observeScenarioRun({
      type: run.type,
      status: run.status,
      durationMs: run.duration ?? 0,
    });

    this.observabilityService.logScenarioRun({
      scenarioType: run.type,
      scenarioId: run.id,
      duration: run.duration ?? 0,
      error: run.error ?? undefined,
    });
  }
}
