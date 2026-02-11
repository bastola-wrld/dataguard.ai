import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { CloudProvider } from '../cloud/cloud.interface';
import { CloudAsset } from '../cloud/cloud.interface';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class AssetsService {
    private logger = new Logger(AssetsService.name);

    constructor(
        private prisma: PrismaService,
        @Inject('CloudProvider') private cloudProvider: CloudProvider, // Injected via module provider
        private eventsGateway: EventsGateway,
    ) { }

    async syncAssets(userId: string) {
        this.eventsGateway.emitLog(`Starting asset sync for user ${userId}...`);
        this.logger.log(`Syncing assets for user ${userId}`);
        const assets = await this.cloudProvider.scan({});
        this.eventsGateway.emitLog(`Cloud scan complete. Found ${assets.length} assets.`);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user || !user.tenantId) {
            this.logger.warn('User has no tenant, skipping sync persistence');
            return [];
        }

        const savedAssets = [];
        for (const asset of assets) {
            const saved = await this.prisma.asset.upsert({
                where: {
                    tenantId_cloudId: {
                        tenantId: user.tenantId,
                        cloudId: asset.cloudId,
                    },
                },
                update: {
                    name: asset.name,
                    type: asset.type,
                    region: asset.region,
                    metadata: JSON.stringify(asset.metadata || {}),
                    updatedAt: new Date(),
                },
                create: {
                    tenantId: user.tenantId,
                    cloudId: asset.cloudId,
                    name: asset.name,
                    type: asset.type,
                    region: asset.region,
                    provider: asset.provider,
                    metadata: JSON.stringify(asset.metadata || {}),
                },
            });
            savedAssets.push(saved);
        }

        this.eventsGateway.emitVulnerabilitiesUpdated();
        return savedAssets;
    }

    async findAll(tenantId: string) {
        return this.prisma.asset.findMany({
            where: { tenantId },
        });
    }

    async createTenantForUser(userId: string, email: string) {
        const tenant = await this.prisma.tenant.create({
            data: {
                name: `${email}'s Organization`,
                users: { connect: [{ id: userId }] },
            },
        });
        // Update user context (optional since connection handled, but good for return)
        await this.prisma.user.update({
            where: { id: userId },
            data: { tenantId: tenant.id },
        });
        return tenant;
    }
}
