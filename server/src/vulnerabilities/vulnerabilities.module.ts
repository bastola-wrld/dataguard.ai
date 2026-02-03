import { Module } from '@nestjs/common';
import { VulnerabilitiesService } from './vulnerabilities.service';
import { VulnerabilitiesController } from './vulnerabilities.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [VulnerabilitiesController],
    providers: [VulnerabilitiesService, PrismaService],
})
export class VulnerabilitiesModule { }
