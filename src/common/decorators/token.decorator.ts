import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthRequest, JwtPayload } from '../interfaces';

export const GetToken = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const token = request.token;
    return data ? token[data] : token;
  },
);
