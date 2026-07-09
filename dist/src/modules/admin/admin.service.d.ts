import { PrismaService } from '../../core/database/prisma.service';
import { VideoService } from '../../core/video/video.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AddMovieFileDto } from './dto/add-movie-file.dto';
export declare class AdminService {
    private readonly prisma;
    private readonly videoService;
    constructor(prisma: PrismaService, videoService: VideoService);
    findAll(): Promise<{
        success: boolean;
        data: {
            movies: {
                id: string;
                title: string;
                slug: string;
                release_year: number;
                subscription_type: import("@prisma/client").$Enums.SubscriptionType;
                view_count: number;
                review_count: number;
                created_at: Date;
                created_by: string;
            }[];
            total: number;
        };
    }>;
    create(payload: CreateMovieDto, adminId: string, posterFilename?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            title: string;
            slug: string;
            created_at: Date;
        };
    }>;
    update(movieId: string, payload: UpdateMovieDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            title: string;
            updated_at: Date;
        };
    }>;
    remove(movieId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addFile(movieId: string, payload: AddMovieFileDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            movie_id: string;
            quality: string;
            language: string;
            size_mb: number;
            file_url: string;
        };
    }>;
    private generateUniqueSlug;
}
