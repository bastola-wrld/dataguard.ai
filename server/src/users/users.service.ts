import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AssetsService } from '../assets/assets.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private assetsService: AssetsService
    ) { }

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });

        // Automatically create a tenant for the new user
        await this.assetsService.createTenantForUser(user.id, user.email);

        return this.prisma.user.findUnique({ where: { id: user.id } }) as any;
    }
}
