import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './core/database/prisma.module';
import { JwtTokenModule } from './core/utils/jwt.module';
import { VideoModule } from './core/video/video.module';
import { SeederModule } from './common/seeders/seeder.module';

import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MoviesModule } from './modules/movies/movies.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { WatchHistoryModule } from './modules/watch-history/watch-history.module';
import { AdminModule } from './modules/admin/admin.module';
import { SuperadminModule } from './modules/superadmin/superadmin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src', 'uploads'),
      serveRoot: '/uploads',
    }),

    PrismaModule,
    JwtTokenModule,
    VideoModule,
    SeederModule,

    AuthModule,
    ProfileModule,
    SubscriptionsModule,
    CategoriesModule,
    MoviesModule,
    FavoritesModule,
    ReviewsModule,
    WatchHistoryModule, 
    AdminModule,
    SuperadminModule, 
  ],
})
export class AppModule {}
