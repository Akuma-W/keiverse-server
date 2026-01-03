import { Role } from '../enums/roles.enum';

export interface JwtPayload {
  sub: number;
  jti: string;
  role: Role;
}
