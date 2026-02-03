import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VulnerabilitiesService } from './vulnerabilities.service';

@Controller('vulnerabilities')
@UseGuards(AuthGuard('jwt'))
export class VulnerabilitiesController {
    constructor(private service: VulnerabilitiesService) { }

    @Get()
    async list(@Request() req: any) {
        if (!req.user.tenantId) return [];
        return this.service.findAll(req.user.tenantId);
    }

    @Post('generate-mock')
    async generate(@Request() req: any) {
        if (!req.user.tenantId) return { message: 'No tenant' };
        await this.service.generateMockFindings(req.user.tenantId);
        return { message: 'Findings generated' };
    }
}
