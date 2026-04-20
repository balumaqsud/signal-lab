import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RunScenarioDto } from './dto/run-scenario.dto';

@Injectable()
export class ScenariosService {
  runScenario(input: RunScenarioDto): {
    id: string;
    type: string;
    status: string;
  } {
    return {
      id: randomUUID(),
      type: input.type,
      status: 'queued',
    };
  }
}
