import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Role } from '@prisma/client';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';


@Injectable()
export class SuperadminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAdmins() {
    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return {
      success: true,
      data: { admins, total: admins.length },
    };
  }

  async createAdmin(payload: CreateAdminDto) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email: payload.email }, { username: payload.username }] },
    });

    if (exists) {
      throw new ConflictException("Bu email yoki username allaqachon ro'yxatdan o'tgan!");
    }

    const admin = await this.prisma.user.create({
      data: {
        username: payload.username,
        email: payload.email,
        password_hash: await argon2.hash(payload.password),
        role: Role.ADMIN,
        profile: { create: {} },
      },
    });

    return {
      success: true,
      message: 'Yangi admin muvaffaqiyatli yaratildi',
      data: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        created_at: admin.created_at,
      },
    };
  }

  async removeAdmin(adminId: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });

    if (!admin) {
      throw new NotFoundException('Admin topilmadi!');
    }
    if (admin.role !== Role.ADMIN) {
      throw new BadRequestException('Bu foydalanuvchi admin emas!');
    }

    await this.prisma.user.update({
      where: { id: adminId },
      data: { role: Role.USER },
    });

    return {
      success: true,
      message: 'Admin huquqlari olib tashlandi (foydalanuvchi USER roliga tushirildi)',
    };
  }

  
  async findAllPlans() {
    const plans = await this.prisma.subscriptionPlan.findMany({ orderBy: { price: 'asc' } });
    return { success: true, data: plans };
  }

  async createPlan(payload: CreatePlanDto) {
    const plan = await this.prisma.subscriptionPlan.create({
      data: {
        name: payload.name,
        price: payload.price,
        duration_days: payload.duration_days,
        features: payload.features,
        is_active: payload.is_active ?? true,
      },
    });

    return {
      success: true,
      message: 'Obuna rejasi muvaffaqiyatli yaratildi',
      data: plan,
    };
  }

  async updatePlan(planId: string, payload: UpdatePlanDto) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException('Obuna rejasi topilmadi!');
    }

    const updated = await this.prisma.subscriptionPlan.update({
      where: { id: planId },
      data: payload,
    });

    return {
      success: true,
      message: 'Obuna rejasi muvaffaqiyatli yangilandi',
      data: updated,
    };
  }


  
  async deactivatePlan(planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException('Obuna rejasi topilmadi!');
    }

    await this.prisma.subscriptionPlan.update({
      where: { id: planId },
      data: { is_active: false },
    });

    return {
      success: true,
      message: "Obuna rejasi o'chirildi (yangi foydalanuvchilar sotib ololmaydi)",
    };
  }
}
