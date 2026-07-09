import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GenerateToken } from '../../core/utils/jwt';

/**
 * AuthGuard - har bir himoyalangan so'rovda JWT tokenni tekshiradi.
 * Token faqat "Authorization: Bearer <token>" headeridan olinadi.
 * Token to'g'ri bo'lsa, undan chiqqan {id, role} ma'lumoti req.user ga yoziladi.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly generateToken: GenerateToken) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token topilmadi, avval tizimga kiring!');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.generateToken.verifyToken(token);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token yaroqsiz yoki muddati tugagan!');
    }
  }
}
