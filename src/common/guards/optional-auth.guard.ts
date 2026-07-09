import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GenerateToken } from '../../core/utils/jwt';

/**
 * OptionalAuthGuard - ochiq (public) endpointlarda ishlatiladi, masalan kinolar ro'yxati.
 * Agar Bearer token yuborilgan va to'g'ri bo'lsa - req.user o'rnatiladi
 * (masalan is_favorite ni bilish uchun). Token bo'lmasa yoki noto'g'ri bo'lsa ham
 * so'rov davom etadi, xatolik tashlanmaydi.
 */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly generateToken: GenerateToken) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers?.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        req.user = await this.generateToken.verifyToken(authHeader.split(' ')[1]);
      } catch {
        // token noto'g'ri bo'lsa ham e'tibor bermaymiz - foydalanuvchi anonim sifatida davom etadi
      }
    }

    return true;
  }
}
