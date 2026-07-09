import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
export interface JwtPayload {
    id: string;
    role: Role;
}
export declare class GenerateToken {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateAccessToken(id: string, role: Role): Promise<string>;
    generateRefreshToken(id: string, role: Role): Promise<string>;
    verifyToken(token: string): Promise<JwtPayload>;
}
