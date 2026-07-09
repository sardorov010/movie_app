"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchHistoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
let WatchHistoryService = class WatchHistoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveProgress(userId, payload) {
        const movie = await this.prisma.movie.findUnique({ where: { id: payload.movie_id } });
        if (!movie) {
            throw new common_1.NotFoundException('Kino topilmadi!');
        }
        const history = await this.prisma.watchHistory.upsert({
            where: {
                user_id_movie_id: { user_id: userId, movie_id: payload.movie_id },
            },
            create: {
                user_id: userId,
                movie_id: payload.movie_id,
                watched_duration: payload.watched_duration,
                watched_percentage: payload.watched_percentage,
            },
            update: {
                watched_duration: payload.watched_duration,
                watched_percentage: payload.watched_percentage,
                last_watched: new Date(),
            },
        });
        return {
            success: true,
            message: "Ko'rish jarayoni saqlandi",
            data: {
                movie_id: history.movie_id,
                watched_duration: history.watched_duration,
                watched_percentage: history.watched_percentage,
                last_watched: history.last_watched,
            },
        };
    }
    async getMyHistory(userId) {
        const history = await this.prisma.watchHistory.findMany({
            where: { user_id: userId },
            include: { movie: true },
            orderBy: { last_watched: 'desc' },
        });
        return {
            success: true,
            data: {
                movies: history.map((h) => ({
                    movie: {
                        id: h.movie.id,
                        title: h.movie.title,
                        slug: h.movie.slug,
                        poster_url: h.movie.poster_url,
                        duration_minutes: h.movie.duration_minutes,
                    },
                    watched_duration: h.watched_duration,
                    watched_percentage: h.watched_percentage,
                    last_watched: h.last_watched,
                })),
                total: history.length,
            },
        };
    }
    async remove(userId, movieId) {
        const record = await this.prisma.watchHistory.findUnique({
            where: { user_id_movie_id: { user_id: userId, movie_id: movieId } },
        });
        if (!record) {
            throw new common_1.NotFoundException("Bu kino ko'rish tarixida topilmadi!");
        }
        await this.prisma.watchHistory.delete({ where: { id: record.id } });
        return {
            success: true,
            message: "Kino ko'rish tarixidan o'chirildi",
        };
    }
};
exports.WatchHistoryService = WatchHistoryService;
exports.WatchHistoryService = WatchHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WatchHistoryService);
//# sourceMappingURL=watch-history.service.js.map