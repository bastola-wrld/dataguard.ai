import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { AssetsModule } from '../assets/assets.module';

@Module({
    imports: [AssetsModule],
    providers: [UsersService, PrismaService],
    exports: [UsersService],
})
export class UsersModule { }
