import { AuthUser } from './auth-user.interface';
import { JwtPayload } from './jwt-payload.interface';

export interface AuthRequest {
  user: AuthUser;
  token: JwtPayload;
}
