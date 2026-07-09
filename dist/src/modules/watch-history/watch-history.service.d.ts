import { PrismaService } from '../../core/database/prisma.service';
import { SaveProgressDto } from './dto/save-progress.dto';
export declare class WatchHistoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    saveProgress(userId: string, payload: SaveProgressDto): Promise<{
        success: boolean;
        message: string;
        data: {
            movie_id: string;
            watched_duration: number;
            watched_percentage: import("@prisma/client/runtime/client").Decimal;
            last_watched: Date;
        };
    }>;
    getMyHistory(userId: string): Promise<{
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
    remove(userId: string, movieId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
