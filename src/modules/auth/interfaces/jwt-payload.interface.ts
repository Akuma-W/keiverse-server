export interface JwtPayload {
  sub: number;
  jti: string;
  email?: string;
  role?: string;
}
