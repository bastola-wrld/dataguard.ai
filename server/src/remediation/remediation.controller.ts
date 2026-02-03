import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RemediationService } from './remediation.service';

@Controller('remediation')
@UseGuards(AuthGuard('jwt'))
export class RemediationController {
    constructor(private service: RemediationService) { }

    @Post('plan/:id')
    async generatePlan(@Param('id') id: string) {
        return this.service.createPlan(id);
    }

    @Post('apply/:id')
    async applyFix(@Param('id') id: string) {
        return this.service.applyFix(id);
    }
}
