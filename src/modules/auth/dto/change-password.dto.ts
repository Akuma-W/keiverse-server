import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

// DTO for changing user password
export class ChangePasswordDto {
  @ApiProperty({
    description: 'The current password of the user',
    example: 'oldPassword123',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'The new password for the user',
    example: 'newSecurePassword456',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  newPassword: string;
}
