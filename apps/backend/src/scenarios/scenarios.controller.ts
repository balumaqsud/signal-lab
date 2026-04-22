import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ScenarioRun } from '@prisma/client';
import { RunScenarioDto } from './dto/run-scenario.dto';
import { ScenariosService } from './scenarios.service';

@ApiTags('scenarios')
@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Post('run')
  @ApiOkResponse({ description: 'Runs a scenario and stores the result' })
  run(@Body() input: RunScenarioDto): Promise<ScenarioRun> {
    return this.scenariosService.runScenario(input);
  }

  @Get('runs')
  @ApiOkResponse({ description: 'Returns the latest 20 scenario runs' })
  listRuns(): Promise<ScenarioRun[]> {
    return this.scenariosService.listRecentRuns(20);
  }
}
