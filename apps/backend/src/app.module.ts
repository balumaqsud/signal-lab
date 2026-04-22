import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { HttpMetricsMiddleware } from './observability/http-metrics.middleware';
import { ObservabilityController } from './observability/observability.controller';
import { ObservabilityService } from './observability/observability.service';
import { ScenariosController } from './scenarios/scenarios.controller';
import { ScenariosService } from './scenarios/scenarios.service';

@Module({
  imports: [],
  controllers: [HealthController, ScenariosController, ObservabilityController],
  providers: [ScenariosService, ObservabilityService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpMetricsMiddleware).forRoutes('*');
  }
}
