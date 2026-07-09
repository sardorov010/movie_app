import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(payload: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user_id: string;
            username: string;
            role: import("@prisma/client").$Enums.Role;
            created_at: Date;
        };
    }>;
    login(payload: LoginDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user_id: string;
            username: string;
            role: import("@prisma/client").$Enums.Role;
            subscription: {
                plan_name: string;
                expires_at: Date | null;
            };
            accessToken: string;
            refreshToken: string;
        };
    }>;
    refresh(payload: RefreshDto): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    logout(): Promise<{
        success: boolean;
        message: string;
    }>;
}
