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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const client_1 = require("@prisma/client");
const auth_guard_1 = require("../../common/guards/auth.guard");
const role_guard_1 = require("../../common/guards/role.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const admin_service_1 = require("./admin.service");
const create_movie_dto_1 = require("./dto/create-movie.dto");
const update_movie_dto_1 = require("./dto/update-movie.dto");
const add_movie_file_dto_1 = require("./dto/add-movie-file.dto");
const posterStorage = (0, multer_1.diskStorage)({
    destination: './src/uploads/posters',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.${file.mimetype.split('/')[1]}`);
    },
});
const imageFileFilter = (req, file, cb) => {
    const allowed = ['jpg', 'jpeg', 'png', 'webp'];
    if (!allowed.includes(file.mimetype.split('/')[1])) {
        return cb(new common_1.UnsupportedMediaTypeException('Faqat rasm fayllariga ruxsat beriladi!'), false);
    }
    cb(null, true);
};
const movieFileStorage = (0, multer_1.diskStorage)({
    destination: './src/uploads/movies',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.${file.mimetype.split('/')[1]}`);
    },
});
const videoFileFilter = (req, file, cb) => {
    const allowed = ['mp4', 'x-matroska', 'webm', 'quicktime', 'x-msvideo'];
    if (!allowed.includes(file.mimetype.split('/')[1])) {
        return cb(new common_1.UnsupportedMediaTypeException('Faqat video fayllariga ruxsat beriladi!'), false);
    }
    cb(null, true);
};
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    findAll() {
        return this.adminService.findAll();
    }
    create(user, payload, poster) {
        return this.adminService.create(payload, user.id, poster?.filename);
    }
    update(movieId, payload) {
        return this.adminService.update(movieId, payload);
    }
    remove(movieId) {
        return this.adminService.remove(movieId);
    }
    addFile(movieId, payload, file) {
        return this.adminService.addFile(movieId, payload, file);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Barcha kinolar - admin ko\'rinishi (GET /api/admin/movies)' }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Yangi kino qo\'shish (POST /api/admin/movies)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                release_year: { type: 'number' },
                duration_minutes: { type: 'number' },
                subscription_type: { type: 'string', enum: ['FREE', 'PREMIUM'] },
                category_ids: { type: 'array', items: { type: 'string' } },
                poster: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('poster', { storage: posterStorage, fileFilter: imageFileFilter })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_movie_dto_1.CreateMovieDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Kinoni yangilash (PUT /api/admin/movies/:movie_id)' }),
    (0, common_1.Put)(':movie_id'),
    __param(0, (0, common_1.Param)('movie_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_movie_dto_1.UpdateMovieDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Kinoni o\'chirish (DELETE /api/admin/movies/:movie_id)' }),
    (0, common_1.Delete)(':movie_id'),
    __param(0, (0, common_1.Param)('movie_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Kinoga video fayl yuklash (POST /api/admin/movies/:movie_id/files)',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
                quality: { type: 'string', example: '720p' },
                language: { type: 'string', example: 'uz' },
            },
        },
    }),
    (0, common_1.Post)(':movie_id/files'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: movieFileStorage, fileFilter: videoFileFilter })),
    __param(0, (0, common_1.Param)('movie_id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_movie_file_dto_1.AddMovieFileDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "addFile", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Movies'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RoleGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPERADMIN),
    (0, common_1.Controller)('admin/movies'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map