import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const scenarioTypes = [
  'success',
  'validation_error',
  'system_error',
  'slow_request',
] as const;

export type ScenarioType = (typeof scenarioTypes)[number];

export class RunScenarioDto {
  @ApiProperty({ enum: scenarioTypes, example: 'success' })
  @IsIn(scenarioTypes)
  @IsString()
  type!: ScenarioType;

  @ApiPropertyOptional({ example: 'Alice' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
