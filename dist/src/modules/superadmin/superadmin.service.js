"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperadminService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../core/database/prisma.service");
let SuperadminService = class SuperadminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllAdmins() {
        const admins = await this.prisma.user.findMany({
            where: { role: client_1.Role.ADMIN },
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
    async createAdmin(payload) {
        const exists = await this.prisma.user.findFirst({
            where: { OR: [{ email: payload.email }, { username: payload.username }] },
        });
        if (exists) {
            throw new common_1.ConflictException("Bu email yoki username allaqachon ro'yxatdan o'tgan!");
        }
        const admin = await this.prisma.user.create({
            data: {
                username: payload.username,
                email: payload.email,
                password_hash: await argon2.hash(payload.password),
                role: client_1.Role.ADMIN,
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
    async removeAdmin(adminId) {
        const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
        if (!admin) {
            throw new common_1.NotFoundException('Admin topilmadi!');
        }
        if (admin.role !== client_1.Role.ADMIN) {
            throw new common_1.BadRequestException('Bu foydalanuvchi admin emas!');
        }
        await this.prisma.user.update({
            where: { id: adminId },
            data: { role: client_1.Role.USER },
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
    async createPlan(payload) {
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
    async updatePlan(planId, payload) {
        const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
        if (!plan) {
            throw new common_1.NotFoundException('Obuna rejasi topilmadi!');
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
    async deactivatePlan(planId) {
        const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
        if (!plan) {
            throw new common_1.NotFoundException('Obuna rejasi topilmadi!');
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
};
exports.SuperadminService = SuperadminService;
exports.SuperadminService = SuperadminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuperadminService);
//# sourceMappingURL=superadmin.service.js.map