import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class SaveProgressDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440020' })
  @IsUUID()
  movie_id: string;

  @ApiProperty({ example: 3600, description: "Ko'rilgan davomiylik (soniyalarda)" })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  watched_duration: number;

  @ApiProperty({ example: 45.5, description: "Ko'rilgan foiz (0-100)" })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  watched_percentage: number;
}
