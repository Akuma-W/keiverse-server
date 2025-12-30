import { Role } from '../enums/roles.enum';

export interface AuthUser {
  id: number;
  role: Role;
}
