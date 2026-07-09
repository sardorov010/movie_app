import type { JwtPayload } from '../../core/utils/jwt';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(user: JwtPayload): Promise<{
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
    updateProfile(user: JwtPayload, payload: UpdateProfileDto): Promise<{
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
