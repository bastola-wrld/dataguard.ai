import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { VulnerabilitiesModule } from './vulnerabilities/vulnerabilities.module';
import { RemediationModule } from './remediation/remediation.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AssetsModule,
    VulnerabilitiesModule,
    RemediationModule,
    EventsModule
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
