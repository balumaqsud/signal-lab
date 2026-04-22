import { Injectable, Logger } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from 'prom-client';

type ScenarioMetricLabels = {
  type: string;
  status: string;
};

type HttpMetricLabels = {
  method: string;
  route: string;
  status: string;
};

@Injectable()
export class ObservabilityService {
  private readonly logger = new Logger(ObservabilityService.name);
  private readonly registry = new Registry();

  private readonly scenarioRunsTotal = new Counter<keyof ScenarioMetricLabels>({
    name: 'scenario_runs_total',
    help: 'Total scenario runs grouped by type and status',
    labelNames: ['type', 'status'],
    registers: [this.registry],
  });

  private readonly scenarioRunDurationSeconds = new Histogram<
    keyof ScenarioMetricLabels
  >({
    name: 'scenario_run_duration_seconds',
    help: 'Scenario run duration in seconds',
    labelNames: ['type', 'status'],
    buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 3, 5, 10],
    registers: [this.registry],
  });

  private readonly httpRequestsTotal = new Counter<keyof HttpMetricLabels>({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status'],
    registers: [this.registry],
  });

  constructor() {
    collectDefaultMetrics({ register: this.registry });
  }

  observeScenarioRun({
    type,
    status,
    durationMs,
  }: {
    type: string;
    status: string;
    durationMs: number;
  }): void {
    this.scenarioRunsTotal.inc({ type, status });
    this.scenarioRunDurationSeconds.observe(
      { type, status },
      Math.max(durationMs, 0) / 1000,
    );
  }

  observeHttpRequest(labels: HttpMetricLabels): void {
    this.httpRequestsTotal.inc(labels);
  }

  logScenarioRun(entry: {
    scenarioType: string;
    scenarioId: string;
    duration: number;
    error?: string;
  }): void {
    const level = entry.error ? 'error' : 'log';
    const payload = {
      event: 'scenario.run',
      ...entry,
      timestamp: new Date().toISOString(),
    };
    this.logger[level](JSON.stringify(payload));
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
