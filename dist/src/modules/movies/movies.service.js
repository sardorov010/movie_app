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
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../core/database/prisma.service");
const quality_constant_1 = require("../../common/constants/quality.constant");
let MoviesService = class MoviesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const where = {
            ...(query.subscription_type && { subscription_type: query.subscription_type }),
            ...(query.search && {
                title: { contains: query.search, mode: 'insensitive' },
            }),
            ...(query.category && {
                categories: { some: { category: { slug: query.category } } },
            }),
        };
        const [movies, total] = await this.prisma.$transaction([
            this.prisma.movie.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: { categories: { include: { category: true } } },
            }),
            this.prisma.movie.count({ where }),
        ]);
        return {
            success: true,
            data: {
                movies: movies.map((movie) => ({
                    id: movie.id,
                    title: movie.title,
                    slug: movie.slug,
                    poster_url: movie.poster_url,
                    release_year: movie.release_year,
                    rating: movie.rating,
                    subscription_type: movie.subscription_type,
                    categories: movie.categories.map((c) => c.category.name),
                })),
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.max(1, Math.ceil(total / limit)),
                },
            },
        };
    }
    async findBySlug(slug, currentUser) {
        const movie = await this.prisma.movie.findUnique({
            where: { slug },
            include: {
                categories: { include: { category: true } },
                files: true,
            },
        });
        if (!movie) {
            throw new common_1.NotFoundException('Kino topilmadi!');
        }
        await this.prisma.movie.update({
            where: { id: movie.id },
            data: { view_count: { increment: 1 } },
        });
        const reviewStats = await this.prisma.review.aggregate({
            where: { movie_id: movie.id },
            _avg: { rating: true },
            _count: { _all: true },
        });
        let isFavorite = false;
        let hasAccess = movie.subscription_type === 'FREE';
        if (currentUser) {
            if (currentUser.role === client_1.Role.ADMIN || currentUser.role === client_1.Role.SUPERADMIN) {
                hasAccess = true;
            }
            const [favorite, activeSubscription] = await this.prisma.$transaction([
                this.prisma.favorite.findUnique({
                    where: { user_id_movie_id: { user_id: currentUser.id, movie_id: movie.id } },
                }),
                this.prisma.userSubscription.findFirst({
                    where: {
                        user_id: currentUser.id,
                        status: 'ACTIVE',
                        OR: [{ end_date: null }, { end_date: { gte: new Date() } }],
                    },
                }),
            ]);
            isFavorite = !!favorite;
            if (activeSubscription) {
                hasAccess = true;
            }
        }
        return {
            success: true,
            data: {
                id: movie.id,
                title: movie.title,
                slug: movie.slug,
                description: movie.description,
                release_year: movie.release_year,
                duration_minutes: movie.duration_minutes,
                poster_url: movie.poster_url,
                rating: movie.rating,
                subscription_type: movie.subscription_type,
                view_count: movie.view_count,
                is_favorite: isFavorite,
                categories: movie.categories.map((c) => c.category.name),
                files: hasAccess
                    ? movie.files.map((file) => ({
                        quality: quality_constant_1.QUALITY_LABELS[file.quality],
                        language: file.language,
                        file_url: file.file_url,
                    }))
                    : [],
                requires_subscription: !hasAccess,
                reviews: {
                    average_rating: reviewStats._avg.rating ? Number(reviewStats._avg.rating.toFixed(1)) : 0,
                    count: reviewStats._count._all,
                },
            },
        };
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MoviesService);
//# sourceMappingURL=movies.service.js.map