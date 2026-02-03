import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', system: 'Dataguard.ai API', timestamp: new Date().toISOString() };
  }
}
