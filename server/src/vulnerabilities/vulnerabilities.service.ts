import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class VulnerabilitiesService {
    constructor(private prisma: PrismaService) { }

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
        const assets = await this.prisma.asset.findMany({ where: { tenantId } });

        // Clear old mock findings to avoid dupes for demo
        // await this.prisma.vulnerability.deleteMany({ where: { asset: { tenantId } } }); 

        for (const asset of assets) {
            if (asset.type === 'S3' && asset.name.includes('public')) {
                await this.prisma.vulnerability.create({
                    data: {
                        title: 'Public S3 Bucket Access',
                        severity: 'HIGH',
                        status: 'OPEN',
                        description: 'S3 bucket allows public read access.',
                        assetId: asset.id
                    }
                });
            }
            if (asset.type === 'EC2') {
                await this.prisma.vulnerability.create({
                    data: {
                        title: 'Unencrypted EBS Volume',
                        severity: 'MEDIUM',
                        status: 'OPEN',
                        description: 'Attached EBS volume is not encrypted.',
                        assetId: asset.id
                    }
                });
            }
        }
    }
}
