import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RunScenarioDto } from './dto/run-scenario.dto';
import { ScenariosService } from './scenarios.service';

type ScenarioRunResponse = {
  id: string;
  type: string;
  status: string;
  duration: number | null;
  error: string | null;
  metadata: unknown;
  createdAt: Date;
};

@ApiTags('scenarios')
@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Post('run')
  @ApiOkResponse({ description: 'Runs a scenario and stores the result' })
  run(@Body() input: RunScenarioDto): Promise<ScenarioRunResponse> {
    return this.scenariosService.runScenario(input);
  }

  @Get('runs')
  @ApiOkResponse({ description: 'Returns the latest 20 scenario runs' })
  listRuns(): Promise<ScenarioRunResponse[]> {
    return this.scenariosService.listRecentRuns(20);
  }
}
