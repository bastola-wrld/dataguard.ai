import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class RemediationService {
    constructor(
        private prisma: PrismaService,
        private aiService: AiService,
        private eventsGateway: EventsGateway,
    ) { }

    async createPlan(vulnerabilityId: string) {
        const vuln = await this.prisma.vulnerability.findUnique({
            where: { id: vulnerabilityId },
            include: { asset: true },
        });

        if (!vuln) throw new NotFoundException('Vulnerability not found');

        // Generate AI fix
        const generatedCode = await this.aiService.generateRemediation(
            vuln.title,
            vuln.asset?.type || 'Unknown',
        );

        return {
            vulnerabilityId,
            explanation: `AI has generated a Terraform configuration to remediate: ${vuln.title}`,
            generatedCode,
            createdAt: new Date(),
        };
    }

    async applyFix(vulnerabilityId: string) {
        const vuln = await this.prisma.vulnerability.update({
            where: { id: vulnerabilityId },
            data: { status: 'RESOLVED' },
        });

        this.eventsGateway.emitVulnerabilitiesUpdated();

        return { success: true, message: 'Fix applied successfully' };
    }
}
