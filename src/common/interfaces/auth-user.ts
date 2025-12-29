import { Role } from '../enums/roles.enum';

export interface AuthUser {
  userId: number;
  role: Role;
}
