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
exports.SuperadminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const auth_guard_1 = require("../../common/guards/auth.guard");
const role_guard_1 = require("../../common/guards/role.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const superadmin_service_1 = require("./superadmin.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const plan_dto_1 = require("./dto/plan.dto");
let SuperadminController = class SuperadminController {
    superadminService;
    constructor(superadminService) {
        this.superadminService = superadminService;
    }
    findAllAdmins() {
        return this.superadminService.findAllAdmins();
    }
    createAdmin(payload) {
        return this.superadminService.createAdmin(payload);
    }
    removeAdmin(id) {
        return this.superadminService.removeAdmin(id);
    }
    findAllPlans() {
        return this.superadminService.findAllPlans();
    }
    createPlan(payload) {
        return this.superadminService.createPlan(payload);
    }
    updatePlan(id, payload) {
        return this.superadminService.updatePlan(id, payload);
    }
    deactivatePlan(id) {
        return this.superadminService.deactivatePlan(id);
    }
};
exports.SuperadminController = SuperadminController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Adminlar ro'yxati (GET /api/superadmin/admins)" }),
    (0, common_1.Get)('admins'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "findAllAdmins", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Yangi admin yaratish (POST /api/superadmin/admins)' }),
    (0, common_1.Post)('admins'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "createAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Admin huquqlarini olib tashlash (DELETE /api/superadmin/admins/:id)" }),
    (0, common_1.Delete)('admins/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "removeAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Barcha rejalar, nofaollari bilan (GET /api/superadmin/plans)" }),
    (0, common_1.Get)('plans'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "findAllPlans", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Yangi obuna rejasi yaratish (POST /api/superadmin/plans)' }),
    (0, common_1.Post)('plans'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [plan_dto_1.CreatePlanDto]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "createPlan", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Rejani yangilash (PUT /api/superadmin/plans/:id)' }),
    (0, common_1.Put)('plans/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, plan_dto_1.UpdatePlanDto]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "updatePlan", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Rejani o'chirish - soft delete (DELETE /api/superadmin/plans/:id)" }),
    (0, common_1.Delete)('plans/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "deactivatePlan", null);
exports.SuperadminController = SuperadminController = __decorate([
    (0, swagger_1.ApiTags)('Superadmin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RoleGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN),
    (0, common_1.Controller)('superadmin'),
    __metadata("design:paramtypes", [superadmin_service_1.SuperadminService])
], SuperadminController);
//# sourceMappingURL=superadmin.controller.js.map