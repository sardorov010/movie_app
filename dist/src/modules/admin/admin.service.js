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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const prisma_service_1 = require("../../core/database/prisma.service");
const video_service_1 = require("../../core/video/video.service");
const slug_util_1 = require("../../common/utils/slug.util");
const quality_constant_1 = require("../../common/constants/quality.constant");
let AdminService = class AdminService {
    prisma;
    videoService;
    constructor(prisma, videoService) {
        this.prisma = prisma;
        this.videoService = videoService;
    }
    async findAll() {
        const movies = await this.prisma.movie.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                creator: { select: { username: true } },
                _count: { select: { reviews: true } },
            },
        });
        return {
            success: true,
            data: {
                movies: movies.map((movie) => ({
                    id: movie.id,
                    title: movie.title,
                    slug: movie.slug,
                    release_year: movie.release_year,
                    subscription_type: movie.subscription_type,
                    view_count: movie.view_count,
                    review_count: movie._count.reviews,
                    created_at: movie.created_at,
                    created_by: movie.creator.username,
                })),
                total: movies.length,
            },
        };
    }
    async create(payload, adminId, posterFilename) {
        const slug = await this.generateUniqueSlug(payload.title);
        const movie = await this.prisma.movie.create({
            data: {
                title: payload.title,
                slug,
                description: payload.description,
                release_year: payload.release_year,
                duration_minutes: payload.duration_minutes,
                subscription_type: payload.subscription_type ?? 'FREE',
                poster_url: posterFilename ? `/uploads/posters/${posterFilename}` : undefined,
                created_by: adminId,
                ...(payload.category_ids?.length && {
                    categories: {
                        create: payload.category_ids.map((categoryId) => ({ category_id: categoryId })),
                    },
                }),
            },
        });
        return {
            success: true,
            message: 'Yangi kino muvaffaqiyatli qo\'shildi',
            data: {
                id: movie.id,
                title: movie.title,
                slug: movie.slug,
                created_at: movie.created_at,
            },
        };
    }
    async update(movieId, payload) {
        const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            throw new common_1.NotFoundException('Kino topilmadi!');
        }
        if (payload.category_ids) {
            await this.prisma.movieCategory.deleteMany({ where: { movie_id: movieId } });
        }
        const updated = await this.prisma.movie.update({
            where: { id: movieId },
            data: {
                title: payload.title,
                description: payload.description,
                release_year: payload.release_year,
                duration_minutes: payload.duration_minutes,
                subscription_type: payload.subscription_type,
                ...(payload.category_ids && {
                    categories: {
                        create: payload.category_ids.map((categoryId) => ({ category_id: categoryId })),
                    },
                }),
            },
        });
        return {
            success: true,
            message: 'Kino muvaffaqiyatli yangilandi',
            data: {
                id: updated.id,
                title: updated.title,
                updated_at: updated.updated_at,
            },
        };
    }
    async remove(movieId) {
        const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            throw new common_1.NotFoundException('Kino topilmadi!');
        }
        await this.prisma.movie.delete({ where: { id: movieId } });
        return {
            success: true,
            message: 'Kino muvaffaqiyatli o\'chirildi',
        };
    }
    async addFile(movieId, payload, file) {
        const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            throw new common_1.NotFoundException('Kino topilmadi!');
        }
        const transcoded = await this.videoService.transcodeToQuality(file.path, payload.quality);
        await (0, promises_1.unlink)(file.path).catch(() => {
        });
        const fileUrl = `/uploads/movies/${transcoded.filename}`;
        const movieFile = await this.prisma.movieFile.create({
            data: {
                movie_id: movieId,
                file_url: fileUrl,
                quality: quality_constant_1.LABEL_TO_QUALITY[payload.quality],
                language: payload.language ?? 'uz',
            },
        });
        return {
            success: true,
            message: 'Kino fayli muvaffaqiyatli yuklandi va qayta ishlandi',
            data: {
                id: movieFile.id,
                movie_id: movieFile.movie_id,
                quality: quality_constant_1.QUALITY_LABELS[movieFile.quality],
                language: movieFile.language,
                size_mb: transcoded.sizeMb,
                file_url: movieFile.file_url,
            },
        };
    }
    async generateUniqueSlug(title) {
        const baseSlug = (0, slug_util_1.toSlug)(title);
        let slug = baseSlug;
        let attempt = 0;
        while (await this.prisma.movie.findUnique({ where: { slug } })) {
            attempt += 1;
            slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
            if (attempt > 10)
                break;
        }
        return slug;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        video_service_1.VideoService])
], AdminService);
//# sourceMappingURL=admin.service.js.map