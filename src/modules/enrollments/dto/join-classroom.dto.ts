import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JoinClassroomDto {
  @ApiProperty({
    description: 'Code of classroom',
    example: '123456',
  })
  @IsString()
  code: string;
}
