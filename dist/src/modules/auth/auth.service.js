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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("../../core/database/prisma.service");
const jwt_1 = require("../../core/utils/jwt");
let AuthService = class AuthService {
    prisma;
    generateToken;
    constructor(prisma, generateToken) {
        this.prisma = prisma;
        this.generateToken = generateToken;
    }
    async register(payload) {
        const exists = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: payload.email }, { username: payload.username }],
            },
        });
        if (exists) {
            throw new common_1.ConflictException("Bu email yoki username allaqachon ro'yxatdan o'tgan!");
        }
        const passwordHash = await argon2.hash(payload.password);
        const user = await this.prisma.user.create({
            data: {
                username: payload.username,
                email: payload.email,
                password_hash: passwordHash,
                profile: { create: {} },
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
    async login(payload) {
        const user = await this.prisma.user.findUnique({ where: { email: payload.email } });
        if (!user) {
            throw new common_1.UnauthorizedException("Email yoki parol noto'g'ri!");
        }
        const isPasswordValid = await argon2.verify(user.password_hash, payload.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Email yoki parol noto'g'ri!");
        }
        const accessToken = await this.generateToken.generateAccessToken(user.id, user.role);
        const refreshToken = await this.generateToken.generateRefreshToken(user.id, user.role);
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
    async refresh(payload) {
        try {
            const decoded = await this.generateToken.verifyToken(payload.refreshToken);
            const user = await this.prisma.user.findUnique({ where: { id: decoded.id } });
            if (!user) {
                throw new common_1.UnauthorizedException();
            }
            return {
                success: true,
                data: {
                    accessToken: await this.generateToken.generateAccessToken(user.id, user.role),
                    refreshToken: await this.generateToken.generateRefreshToken(user.id, user.role),
                },
            };
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token yaroqsiz yoki muddati tugagan!');
        }
    }
    async logout() {
        return {
            success: true,
            message: 'Muvaffaqiyatli tizimdan chiqildi',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.GenerateToken])
], AuthService);
//# sourceMappingURL=auth.service.js.map