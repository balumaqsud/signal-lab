import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { ScenariosController } from './scenarios/scenarios.controller';
import { ScenariosService } from './scenarios/scenarios.service';

@Module({
  imports: [],
  controllers: [HealthController, ScenariosController],
  providers: [ScenariosService],
})
export class AppModule {}
