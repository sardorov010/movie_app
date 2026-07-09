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
exports.WatchHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../common/guards/auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const watch_history_service_1 = require("./watch-history.service");
const save_progress_dto_1 = require("./dto/save-progress.dto");
let WatchHistoryController = class WatchHistoryController {
    watchHistoryService;
    constructor(watchHistoryService) {
        this.watchHistoryService = watchHistoryService;
    }
    getMyHistory(user) {
        return this.watchHistoryService.getMyHistory(user.id);
    }
    saveProgress(user, payload) {
        return this.watchHistoryService.saveProgress(user.id, payload);
    }
    remove(user, movieId) {
        return this.watchHistoryService.remove(user.id, movieId);
    }
};
exports.WatchHistoryController = WatchHistoryController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Ko'rish tarixi ro'yxati (GET /api/watch-history) - 'Davom ettirish' bo'limi uchun" }),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WatchHistoryController.prototype, "getMyHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Ko'rish progressini saqlash (POST /api/watch-history) - video player yuboradi" }),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, save_progress_dto_1.SaveProgressDto]),
    __metadata("design:returntype", void 0)
], WatchHistoryController.prototype, "saveProgress", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Kinoni tarixdan o'chirish (DELETE /api/watch-history/:movie_id)" }),
    (0, common_1.Delete)(':movie_id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('movie_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WatchHistoryController.prototype, "remove", null);
exports.WatchHistoryController = WatchHistoryController = __decorate([
    (0, swagger_1.ApiTags)('Watch History'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('watch-history'),
    __metadata("design:paramtypes", [watch_history_service_1.WatchHistoryService])
], WatchHistoryController);
//# sourceMappingURL=watch-history.controller.js.map