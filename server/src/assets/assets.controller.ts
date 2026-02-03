import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('assets')
@UseGuards(AuthGuard('jwt'))
export class AssetsController {
    constructor(private assetsService: AssetsService) { }

    // Trigger a scan
    @Post('scan')
    async scan(@Request() req: any) {
        // For MVP, we assume user is tied to a tenant.
        // However, our User model has tenantId nullable. 
        // We'll auto-create a tenant if missing or use a default one for the demo.

        // Quick Hack: If user has no tenant, create one.
        // Ideally this happens on registration.

        // For now, let's assume we pass a dummy tenant ID or fetch user's tenant.
        const user = req.user;
        if (!user.tenantId) {
            // Auto-create tenant
            const tenant = await this.assetsService.createTenantForUser(user.id, user.email);
            user.tenantId = tenant.id;
        }

        return this.assetsService.syncAssets(user.tenantId);
    }

    @Get()
    async list(@Request() req: any) {
        if (!req.user.tenantId) return [];
        return this.assetsService.findAll(req.user.tenantId);
    }
}
