import { Module } from '@nestjs/common';
import { RemediationService } from './remediation.service';
import { RemediationController } from './remediation.controller';
import { PrismaService } from '../prisma.service';
import { AiModule } from '../ai/ai.module';

@Module({
    imports: [AiModule],
    controllers: [RemediationController],
    providers: [RemediationService, PrismaService],
})
export class RemediationModule { }
