import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class JoinClassroomDto {
  @ApiProperty({ example: 'CLASS123ABC' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  code: string;
}
