import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthRequest } from '../interfaces/auth-request.interface';
import { AuthUser } from '../interfaces/auth-user.interface';

// Extracts the current user from the request (JWT payload)
export const GetUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
