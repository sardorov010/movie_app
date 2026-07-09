import { PrismaService } from '../../core/database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMyProfile(userId: string): Promise<{
        success: boolean;
        data: {
            user_id: string;
            full_name: string | null;
            phone: string | null;
            country: string | null;
            created_at: Date;
            avatar_url: string | null;
        };
    }>;
    updateMyProfile(userId: string, payload: UpdateProfileDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user_id: string;
            full_name: string | null;
            phone: string | null;
            country: string | null;
            updated_at: Date;
        };
    }>;
}
