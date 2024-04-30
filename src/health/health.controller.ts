// Nest Packages
import { Controller, Get, UseGuards } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';

// Custom Packages
import { AllowRole } from '@app/common/decorator';
import { HealthV1ControllerDocs } from './docs';
import { HealthService } from './health.service';
import { RoleGuard } from '@app/common/guard';

@Controller('health')
@UseGuards(RoleGuard)
@AllowRole(['ADMIN'])
@HealthV1ControllerDocs
export class HealthController {
  constructor(private service: HealthService) {}

  @Get()
  @HealthCheck()
  check() {
    return this.service.check();
  }
}
