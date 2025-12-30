import { PartialType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create-user.dto';

// DTO for updating user information
export class UpdateUserDto extends PartialType(CreateUserDto) {}
