import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { AiService } from '../ai/ai.service';

@Injectable()
export class VulnerabilitiesService {
    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway,
        private aiService: AiService
    ) { }

    async findAll(tenantId: string) {
        return this.prisma.vulnerability.findMany({
            where: {
                asset: {
                    tenantId: tenantId
                }
            },
            include: {
                asset: true
            }
        });
    }

    async generateMockFindings(tenantId: string) {
        this.eventsGateway.emitLog('Starting vulnerability analysis...');
        const assets = await this.prisma.asset.findMany({ where: { tenantId } });

        this.eventsGateway.emitLog(`Analyzing ${assets.length} assets against policy definitions...`);

        // Clear old mock findings to avoid dupes for demo
        // await this.prisma.vulnerability.deleteMany({ where: { asset: { tenantId } } }); 

        for (const asset of assets) {
            const assetAny = asset as any;
            const metadata = assetAny.metadata ? JSON.parse(assetAny.metadata) : {};

            const createVulnerability = async (title: string, severity: string, description: string) => {
                const riskScore = await this.aiService.calculateRiskScore(title, severity);
                await this.prisma.vulnerability.create({
                    data: {
                        title,
                        severity,
                        riskScore,
                        status: 'OPEN',
                        description,
                        assetId: asset.id
                    }
                });
            };

            if (asset.type === 'S3' && metadata.publicAccess === true) {
                await createVulnerability('Public S3 Bucket Access', 'HIGH', 'S3 bucket allows public read access.');
            }
            if (asset.type === 'S3' && metadata.encrypted === false) {
                await createVulnerability('Unencrypted S3 Bucket', 'MEDIUM', 'S3 bucket is not encrypted at rest.');
            }
            if (asset.type === 'EC2' && metadata.publicIp) {
                await createVulnerability('EC2 Instance Exposed to Public Internet', 'CRITICAL', `Instance has public IP: ${metadata.publicIp}`);
            }
            if (asset.type === 'RDS' && metadata.publiclyAccessible === true) {
                await createVulnerability('Publicly Accessible RDS Instance', 'CRITICAL', 'RDS instance is publicly accessible, posing a severe data leak risk.');
            }
            if (asset.type === 'RDS' && metadata.storageEncrypted === false) {
                await createVulnerability('Unencrypted RDS Storage', 'HIGH', 'RDS storage is not encrypted at rest.');
            }
        }

        this.eventsGateway.emitVulnerabilitiesUpdated();
    }
}
