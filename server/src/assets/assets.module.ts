import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { PrismaService } from '../prisma.service';
import { CloudModule } from '../cloud/cloud.module';

@Module({
    imports: [CloudModule],
    controllers: [AssetsController],
    providers: [AssetsService, PrismaService],
})
export class AssetsModule { }
