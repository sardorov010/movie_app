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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../core/database/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, movieId, payload) {
        const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            throw new common_1.NotFoundException('Kino topilmadi!');
        }
        const existingReview = await this.prisma.review.findFirst({
            where: { movie_id: movieId, user_id: userId },
        });
        if (existingReview) {
            throw new common_1.ConflictException('Siz bu kinoga allaqachon sharh qoldirgansiz!');
        }
        const review = await this.prisma.review.create({
            data: {
                user_id: userId,
                movie_id: movieId,
                rating: payload.rating,
                comment: payload.comment,
            },
            include: { user: { select: { id: true, username: true } } },
        });
        await this.recalculateMovieRating(movieId);
        return {
            success: true,
            message: 'Sharh muvaffaqiyatli qo\'shildi',
            data: {
                id: review.id,
                user: { id: review.user.id, username: review.user.username },
                movie_id: review.movie_id,
                rating: review.rating,
                comment: review.comment,
                created_at: review.created_at,
            },
        };
    }
    async remove(userId, userRole, movieId, reviewId) {
        const review = await this.prisma.review.findFirst({
            where: { id: reviewId, movie_id: movieId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Sharh topilmadi!');
        }
        const isOwner = review.user_id === userId;
        const isModerator = userRole === client_1.Role.ADMIN || userRole === client_1.Role.SUPERADMIN;
        if (!isOwner && !isModerator) {
            throw new common_1.ForbiddenException('Siz faqat o\'zingizning sharhingizni o\'chira olasiz!');
        }
        await this.prisma.review.delete({ where: { id: reviewId } });
        await this.recalculateMovieRating(movieId);
        return {
            success: true,
            message: 'Sharh muvaffaqiyatli o\'chirildi',
        };
    }
    async recalculateMovieRating(movieId) {
        const stats = await this.prisma.review.aggregate({
            where: { movie_id: movieId },
            _avg: { rating: true },
        });
        await this.prisma.movie.update({
            where: { id: movieId },
            data: { rating: stats._avg.rating ?? 0 },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map