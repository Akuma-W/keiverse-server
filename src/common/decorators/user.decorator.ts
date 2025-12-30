import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';

import { AuthUser } from '../interfaces/auth-user';

// Extracts the current user from the request (JWT payload)
export const GetUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUser }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
