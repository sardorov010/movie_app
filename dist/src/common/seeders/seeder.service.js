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
var SeederService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../core/database/prisma.service");
let SeederService = SeederService_1 = class SeederService {
    prisma;
    logger = new common_1.Logger(SeederService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        await this.seedSuperadmin();
        await this.seedSubscriptionPlans();
    }
    async seedSuperadmin() {
        const email = process.env.SUPERADMIN_EMAIL || 'superadmin@kinolar.uz';
        const password = process.env.SUPERADMIN_PASSWORD || 'SuperAdmin123';
        const exists = await this.prisma.user.findFirst({
            where: {
                OR: [{ email }, { username: 'superadmin' }],
            },
        });
        if (exists) {
            this.logger.log('Superadmin allaqachon mavjud');
            return;
        }
        await this.prisma.user.create({
            data: {
                username: 'superadmin',
                email,
                password_hash: await argon2.hash(password),
                role: client_1.Role.SUPERADMIN,
                profile: { create: { full_name: 'Bosh Administrator' } },
            },
        });
        this.logger.log(`Superadmin yaratildi -> email: ${email}`);
    }
    async seedSubscriptionPlans() {
        const count = await this.prisma.subscriptionPlan.count();
        if (count > 0) {
            this.logger.log('Obuna rejalari allaqachon mavjud');
            return;
        }
        await this.prisma.subscriptionPlan.createMany({
            data: [
                {
                    name: 'Free',
                    price: 0,
                    duration_days: 0,
                    features: ['SD sifatli kinolar', 'Reklama bilan'],
                },
                {
                    name: 'Premium',
                    price: 49.99,
                    duration_days: 30,
                    features: ['HD sifatli kinolar', 'Reklamasiz', 'Yangi kinolar'],
                },
            ],
        });
        this.logger.log('Standart obuna rejalari (Free, Premium) yaratildi');
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = SeederService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeederService);
//# sourceMappingURL=seeder.service.js.map