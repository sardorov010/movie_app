import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GenerateToken } from '../../core/utils/jwt';
export declare class AuthGuard implements CanActivate {
    private readonly generateToken;
    constructor(generateToken: GenerateToken);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
