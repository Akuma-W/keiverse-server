import { Public } from '@/common/decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

@Controller('app')
export class AppController {
  @ApiProperty()
  @Public()
  @Get('/health')
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
