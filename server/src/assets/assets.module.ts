import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { PrismaService } from '../prisma.service';
import { CloudModule } from '../cloud/cloud.module';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [CloudModule, EventsModule],
    controllers: [AssetsController],
    providers: [AssetsService, PrismaService],
    exports: [AssetsService],
})
export class AssetsModule { }
