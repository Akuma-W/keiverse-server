import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/roles.enum';

// Set roles required for the endpoint
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
