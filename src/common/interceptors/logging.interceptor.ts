import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      body: Record<string, unknown>;
      params: Record<string, unknown>;
      query: Record<string, unknown>;
    }>();
    const { method, url, body, params, query } = request;
    const now = Date.now();

    // Log request
    this.logger.log(
      `Request: ${method} ${url} - Body: ${JSON.stringify(body)} - Params: ${JSON.stringify(params)} - Query: ${JSON.stringify(query)}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `Response: ${method} ${url} - Status: Success - Time: ${responseTime}ms`,
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `Response: ${method} ${url} - Status: Error - Time: ${responseTime}ms - Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
