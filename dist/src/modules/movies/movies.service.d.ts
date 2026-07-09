import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/database/prisma.service';
import { MovieQueryDto } from './dto/movie-query.dto';
import type { JwtPayload } from '../../core/utils/jwt';
export declare class MoviesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: MovieQueryDto): Promise<{
        success: boolean;
        data: {
            movies: {
                id: string;
                title: string;
                slug: string;
                poster_url: string | null;
                release_year: number;
                rating: Prisma.Decimal;
                subscription_type: import("@prisma/client").$Enums.SubscriptionType;
                categories: string[];
            }[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
            };
        };
    }>;
    findBySlug(slug: string, currentUser?: JwtPayload): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
            slug: string;
            description: string | null;
            release_year: number;
            duration_minutes: number;
            poster_url: string | null;
            rating: Prisma.Decimal;
            subscription_type: import("@prisma/client").$Enums.SubscriptionType;
            view_count: number;
            is_favorite: boolean;
            categories: string[];
            files: {
                quality: string;
                language: string;
                file_url: string;
            }[];
            requires_subscription: boolean;
            reviews: {
                average_rating: number;
                count: number;
            };
        };
    }>;
}
