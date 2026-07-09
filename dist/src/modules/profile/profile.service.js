"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
let ProfileService = class ProfileService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyProfile(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
            include: { user: { select: { avatar_url: true } } },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profil topilmadi!');
        }
        return {
            success: true,
            data: {
                user_id: profile.user_id,
                full_name: profile.full_name,
                phone: profile.phone,
                country: profile.country,
                created_at: profile.created_at,
                avatar_url: profile.user.avatar_url,
            },
        };
    }
    async updateMyProfile(userId, payload) {
        const profile = await this.prisma.profile.update({
            where: { user_id: userId },
            data: payload,
        });
        return {
            success: true,
            message: 'Profil muvaffaqiyatli yangilandi',
            data: {
                user_id: profile.user_id,
                full_name: profile.full_name,
                phone: profile.phone,
                country: profile.country,
                updated_at: new Date(),
            },
        };
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map