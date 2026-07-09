import type { JwtPayload } from '../../core/utils/jwt';
import { MoviesService } from './movies.service';
import { MovieQueryDto } from './dto/movie-query.dto';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    findAll(query: MovieQueryDto): Promise<{
        success: boolean;
        data: {
            movies: {
                id: string;
                title: string;
                slug: string;
                poster_url: string | null;
                release_year: number;
                rating: import("@prisma/client/runtime/client").Decimal;
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
    findOne(slug: string, user: JwtPayload): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
            slug: string;
            description: string | null;
            release_year: number;
            duration_minutes: number;
            poster_url: string | null;
            rating: import("@prisma/client/runtime/client").Decimal;
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
