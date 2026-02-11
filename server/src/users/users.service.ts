import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AssetsService } from '../assets/assets.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

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
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                verificationToken,
                verified: false,
            },
        });

        // MOCK EMAIL LOGGING
        const verificationUrl = `http://localhost:3000/verify?token=${verificationToken}`;
        this.logger.log(`\n\n📧 MOCK EMAIL SENT TO: ${user.email}\n🔗 VERIFICATION LINK: ${verificationUrl}\n\n`);

        // Automatically create a tenant for the new user
        await this.assetsService.createTenantForUser(user.id, user.email);

        return this.prisma.user.findUnique({ where: { id: user.id } }) as any;
    }

    async verifyUser(token: string): Promise<boolean> {
        const user = await this.prisma.user.findFirst({
            where: { verificationToken: token },
        });

        if (!user) return false;

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                verified: true,
                verificationToken: null,
            },
        });

        return true;
    }
}
