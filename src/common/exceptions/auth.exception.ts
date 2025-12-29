import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException extends HttpException {
  constructor(message: string, status = HttpStatus.UNAUTHORIZED) {
    super({ error: 'AUTH_ERROR', message }, status);
  }
}
