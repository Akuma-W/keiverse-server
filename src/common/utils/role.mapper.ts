import { UnauthorizedException } from '@nestjs/common';

import { Role } from '../enums/roles.enum';

export function mapRole(role: string): Role {
  if (!Object.values(Role).includes(role as Role)) {
    throw new UnauthorizedException(`Invalid role: ${role}`);
  }
  return role as Role;
}
