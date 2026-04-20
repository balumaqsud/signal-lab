import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RunScenarioDto } from './dto/run-scenario.dto';
import { ScenariosService } from './scenarios.service';

@ApiTags('scenarios')
@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Post('run')
  @ApiOkResponse({ description: 'Runs a scenario (stub implementation)' })
  run(@Body() input: RunScenarioDto): {
    id: string;
    type: string;
    status: string;
  } {
    return this.scenariosService.runScenario(input);
  }
}
