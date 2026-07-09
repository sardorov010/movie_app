"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const prisma_module_1 = require("./core/database/prisma.module");
const jwt_module_1 = require("./core/utils/jwt.module");
const video_module_1 = require("./core/video/video.module");
const seeder_module_1 = require("./common/seeders/seeder.module");
const auth_module_1 = require("./modules/auth/auth.module");
const profile_module_1 = require("./modules/profile/profile.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const categories_module_1 = require("./modules/categories/categories.module");
const movies_module_1 = require("./modules/movies/movies.module");
const favorites_module_1 = require("./modules/favorites/favorites.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const watch_history_module_1 = require("./modules/watch-history/watch-history.module");
const admin_module_1 = require("./modules/admin/admin.module");
const superadmin_module_1 = require("./modules/superadmin/superadmin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'src', 'uploads'),
                serveRoot: '/uploads',
            }),
            prisma_module_1.PrismaModule,
            jwt_module_1.JwtTokenModule,
            video_module_1.VideoModule,
            seeder_module_1.SeederModule,
            auth_module_1.AuthModule,
            profile_module_1.ProfileModule,
            subscriptions_module_1.SubscriptionsModule,
            categories_module_1.CategoriesModule,
            movies_module_1.MoviesModule,
            favorites_module_1.FavoritesModule,
            reviews_module_1.ReviewsModule,
            watch_history_module_1.WatchHistoryModule,
            admin_module_1.AdminModule,
            superadmin_module_1.SuperadminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map