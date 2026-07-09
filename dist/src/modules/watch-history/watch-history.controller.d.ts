import type { JwtPayload } from '../../core/utils/jwt';
import { WatchHistoryService } from './watch-history.service';
import { SaveProgressDto } from './dto/save-progress.dto';
export declare class WatchHistoryController {
    private readonly watchHistoryService;
    constructor(watchHistoryService: WatchHistoryService);
    getMyHistory(user: JwtPayload): Promise<{
        success: boolean;
        data: {
            movies: {
                movie: {
                    id: string;
                    title: string;
                    slug: string;
                    poster_url: string | null;
                    duration_minutes: number;
                };
                watched_duration: number;
                watched_percentage: import("@prisma/client/runtime/client").Decimal;
                last_watched: Date;
            }[];
            total: number;
        };
    }>;
    saveProgress(user: JwtPayload, payload: SaveProgressDto): Promise<{
        success: boolean;
        message: string;
        data: {
            movie_id: string;
            watched_duration: number;
            watched_percentage: import("@prisma/client/runtime/client").Decimal;
            last_watched: Date;
        };
    }>;
    remove(user: JwtPayload, movieId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
