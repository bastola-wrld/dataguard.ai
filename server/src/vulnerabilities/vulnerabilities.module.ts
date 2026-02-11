import { Module } from '@nestjs/common';
import { VulnerabilitiesService } from './vulnerabilities.service';
import { VulnerabilitiesController } from './vulnerabilities.controller';
import { PrismaService } from '../prisma.service';
import { EventsModule } from '../events/events.module';
import { AiModule } from '../ai/ai.module';

@Module({
    imports: [EventsModule, AiModule],
    controllers: [VulnerabilitiesController],
    providers: [VulnerabilitiesService, PrismaService],
})
export class VulnerabilitiesModule { }
