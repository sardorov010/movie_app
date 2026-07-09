import type { JwtPayload } from '../../core/utils/jwt';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './dto/add-favorite.dto';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    findAll(user: JwtPayload): Promise<{
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
    add(user: JwtPayload, payload: AddFavoriteDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            movie_id: string;
            movie_title: string;
            created_at: Date;
        };
    }>;
    remove(user: JwtPayload, movieId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
