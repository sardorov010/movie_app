import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../../core/database/prisma.service';
import { GenerateToken } from '../../core/utils/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly generateToken: GenerateToken,
  ) {}

  /**
   * Yangi foydalanuvchini ro'yxatdan o'tkazadi.
   * - email yoki username band bo'lsa xatolik qaytaradi
   * - parolni argon2 bilan xeshlaydi (hech qachon ochiq holda saqlanmaydi)
   * - foydalanuvchi bilan birga bo'sh Profile yozuvini ham yaratadi (keyinchalik to'ldirish uchun)
   */
  async register(payload: RegisterDto) {
    const exists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: payload.email }, { username: payload.username }],
      },
    });

    if (exists) {
      throw new ConflictException("Bu email yoki username allaqachon ro'yxatdan o'tgan!");
    }

    const passwordHash = await argon2.hash(payload.password);

    const user = await this.prisma.user.create({
      data: {
        username: payload.username,
        email: payload.email,
        password_hash: passwordHash,
        profile: { create: {} }, // bo'sh profil - foydalanuvchi keyin to'ldiradi
      },
    });

    return {
      success: true,
      message: "Ro'yxatdan muvaffaqiyatli o'tdingiz",
      data: {
        user_id: user.id,
        username: user.username,
        role: user.role,
        created_at: user.created_at,
      },
    };
  }

  /**
   * Email va parol orqali tizimga kiritadi.
   * - parolni argon2.verify bilan tekshiradi
   * - accessToken (30 daqiqa) va refreshToken (7 kun) javob body'sida qaytariladi.
   *   Frontend accessToken'ni har bir so'rovda "Authorization: Bearer <token>" header
   *   sifatida yuborishi kerak. Cookie ishlatilmaydi.
   */
  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri!");
    }

    const isPasswordValid = await argon2.verify(user.password_hash, payload.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri!");
    }

    const accessToken = await this.generateToken.generateAccessToken(user.id, user.role);
    const refreshToken = await this.generateToken.generateRefreshToken(user.id, user.role);

    // Foydalanuvchining eng so'nggi faol (ACTIVE) obunasini topamiz
    const activeSubscription = await this.prisma.userSubscription.findFirst({
      where: { user_id: user.id, status: 'ACTIVE' },
      include: { plan: true },
      orderBy: { end_date: 'desc' },
    });

    return {
      success: true,
      message: 'Muvaffaqiyatli kirildi',
      data: {
        user_id: user.id,
        username: user.username,
        role: user.role,
        subscription: {
          plan_name: activeSubscription?.plan.name ?? 'Free',
          expires_at: activeSubscription?.end_date ?? null,
        },
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Refresh token orqali yangi access token beradi.
   * Access token muddati (30 daqiqa) tugaganda frontend shu endpointga
   * refreshToken yuborib, qaytadan login qilmasdan yangi token oladi.
   */
  async refresh(payload: RefreshDto) {
    try {
      const decoded = await this.generateToken.verifyToken(payload.refreshToken);

      // Foydalanuvchi hali ham mavjudligini tekshiramiz (o'chirilgan bo'lishi mumkin)
      const user = await this.prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        throw new UnauthorizedException();
      }

      return {
        success: true,
        data: {
          accessToken: await this.generateToken.generateAccessToken(user.id, user.role),
          refreshToken: await this.generateToken.generateRefreshToken(user.id, user.role),
        },
      };
    } catch {
      throw new UnauthorizedException('Refresh token yaroqsiz yoki muddati tugagan!');
    }
  }

  /**
   * Logout - token server tomonda saqlanmagani (stateless JWT) uchun bu yerda
   * hech narsa o'chirilmaydi; frontend o'zidagi tokenlarni o'chirib tashlashi kifoya.
   */
  async logout() {
    return {
      success: true,
      message: 'Muvaffaqiyatli tizimdan chiqildi',
    };
  }
}
