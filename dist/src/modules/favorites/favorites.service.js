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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
let FavoritesService = class FavoritesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        const favorites = await this.prisma.favorite.findMany({
            where: { user_id: userId },
            include: { movie: true },
            orderBy: { created_at: 'desc' },
        });
        return {
            success: true,
            data: {
                movies: favorites.map((f) => ({
                    id: f.movie.id,
                    title: f.movie.title,
                    slug: f.movie.slug,
                    poster_url: f.movie.poster_url,
                    release_year: f.movie.release_year,
                    rating: f.movie.rating,
                    subscription_type: f.movie.subscription_type,
                })),
                total: favorites.length,
            },
        };
    }
    async add(userId, movieId) {
        const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            throw new common_1.NotFoundException('Kino topilmadi!');
        }
        const exists = await this.prisma.favorite.findUnique({
            where: { user_id_movie_id: { user_id: userId, movie_id: movieId } },
        });
        if (exists) {
            throw new common_1.ConflictException('Bu kino allaqachon sevimlilar ro\'yxatida!');
        }
        const favorite = await this.prisma.favorite.create({
            data: { user_id: userId, movie_id: movieId },
        });
        return {
            success: true,
            message: 'Kino sevimlilar ro\'yxatiga qo\'shildi',
            data: {
                id: favorite.id,
                movie_id: movie.id,
                movie_title: movie.title,
                created_at: favorite.created_at,
            },
        };
    }
    async remove(userId, movieId) {
        const favorite = await this.prisma.favorite.findUnique({
            where: { user_id_movie_id: { user_id: userId, movie_id: movieId } },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Bu kino sevimlilar ro\'yxatida topilmadi!');
        }
        await this.prisma.favorite.delete({ where: { id: favorite.id } });
        return {
            success: true,
            message: 'Kino sevimlilar ro\'yxatidan o\'chirildi',
        };
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map