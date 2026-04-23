import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// Core modules
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { QueueModule } from './queue/queue.module';

// Feature modules
import { UsersModule } from './modules/users/users.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { UnitsModule } from './modules/units/units.module';
import { DispatcherModule } from './modules/dispatcher/dispatcher.module';
import { LocationsModule } from './modules/locations/locations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UssdModule } from './modules/ussd/ussd.module';
import { KycModule } from './modules/kyc/kyc.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { TrackingModule } from './modules/tracking/tracking.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env.local', '../../.env', '.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Scheduled tasks
    ScheduleModule.forRoot(),

    // Core modules
    DatabaseModule,
    AuthModule,
    RedisModule,
    QueueModule,

    // Feature modules
    UsersModule,
    ContactsModule,
    IncidentsModule,
    DispatchModule,
    UnitsModule,
    DispatcherModule,
    LocationsModule,
    NotificationsModule,
    UssdModule,
    KycModule,
    RealtimeModule,
    TrackingModule,
  ],
})
export class AppModule {}
