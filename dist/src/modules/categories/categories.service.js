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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const slug_util_1 = require("../../common/utils/slug.util");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const categories = await this.prisma.category.findMany({ orderBy: { name: 'asc' } });
        return {
            success: true,
            data: categories,
        };
    }
    async create(payload) {
        const slug = (0, slug_util_1.toSlug)(payload.name);
        const exists = await this.prisma.category.findUnique({ where: { slug } });
        if (exists) {
            throw new common_1.ConflictException('Bu nomdagi kategoriya allaqachon mavjud!');
        }
        const category = await this.prisma.category.create({
            data: { name: payload.name, slug, description: payload.description },
        });
        return {
            success: true,
            message: 'Kategoriya muvaffaqiyatli yaratildi',
            data: category,
        };
    }
    async update(id, payload) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Kategoriya topilmadi!');
        }
        const updated = await this.prisma.category.update({
            where: { id },
            data: {
                name: payload.name,
                description: payload.description,
                ...(payload.name && { slug: (0, slug_util_1.toSlug)(payload.name) }),
            },
        });
        return {
            success: true,
            message: 'Kategoriya muvaffaqiyatli yangilandi',
            data: updated,
        };
    }
    async remove(id) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Kategoriya topilmadi!');
        }
        await this.prisma.category.delete({ where: { id } });
        return {
            success: true,
            message: 'Kategoriya muvaffaqiyatli o\'chirildi',
        };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map