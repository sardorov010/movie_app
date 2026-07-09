import { PrismaService } from '../../core/database/prisma.service';
import { GenerateToken } from '../../core/utils/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly generateToken;
    constructor(prisma: PrismaService, generateToken: GenerateToken);
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
