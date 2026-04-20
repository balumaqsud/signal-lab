import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RunScenarioDto {
  @ApiProperty({ example: 'happy_path' })
  @IsString()
  type!: string;

  @ApiPropertyOptional({ example: '{"source":"frontend"}' })
  @IsOptional()
  @IsString()
  payload?: string;
}
