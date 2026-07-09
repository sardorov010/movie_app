import { PrismaService } from '../../core/database/prisma.service';
export declare class FavoritesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
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
            }[];
            total: number;
        };
    }>;
    add(userId: string, movieId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            movie_id: string;
            movie_title: string;
            created_at: Date;
        };
    }>;
    remove(userId: string, movieId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
