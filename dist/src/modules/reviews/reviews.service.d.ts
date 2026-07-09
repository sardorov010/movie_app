import { Role } from '@prisma/client';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, movieId: string, payload: CreateReviewDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            user: {
                id: string;
                username: string;
            };
            movie_id: string;
            rating: number;
            comment: string | null;
            created_at: Date;
        };
    }>;
    remove(userId: string, userRole: Role, movieId: string, reviewId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private recalculateMovieRating;
}
