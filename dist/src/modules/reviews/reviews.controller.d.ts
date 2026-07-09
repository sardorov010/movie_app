import type { JwtPayload } from '../../core/utils/jwt';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(user: JwtPayload, movieId: string, payload: CreateReviewDto): Promise<{
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
    remove(user: JwtPayload, movieId: string, reviewId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
