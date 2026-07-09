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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
let SubscriptionsService = class SubscriptionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPlans() {
        const plans = await this.prisma.subscriptionPlan.findMany({
            where: { is_active: true },
            orderBy: { price: 'asc' },
        });
        return {
            success: true,
            data: plans.map((plan) => ({
                id: plan.id,
                name: plan.name,
                price: plan.price,
                duration_days: plan.duration_days,
                features: plan.features,
            })),
        };
    }
    async purchase(userId, payload) {
        const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: payload.plan_id } });
        if (!plan || !plan.is_active) {
            throw new common_1.NotFoundException('Obuna rejasi topilmadi yoki faol emas!');
        }
        if (Number(plan.price) < 0) {
            throw new common_1.BadRequestException('Reja narxi noto\'g\'ri!');
        }
        const startDate = new Date();
        const endDate = plan.duration_days > 0
            ? new Date(startDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000)
            : null;
        const result = await this.prisma.$transaction(async (tx) => {
            const subscription = await tx.userSubscription.create({
                data: {
                    user_id: userId,
                    plan_id: plan.id,
                    start_date: startDate,
                    end_date: endDate,
                    status: 'ACTIVE',
                    auto_renew: payload.auto_renew ?? false,
                },
            });
            const payment = await tx.payment.create({
                data: {
                    user_subscription_id: subscription.id,
                    amount: plan.price,
                    payment_method: payload.payment_method,
                    payment_details: payload.payment_details ?? {},
                    status: 'COMPLETED',
                    external_transaction_id: `txn_${Date.now()}`,
                },
            });
            return { subscription, payment };
        });
        return {
            success: true,
            message: 'Obuna muvaffaqiyatli sotib olindi',
            data: {
                subscription: {
                    id: result.subscription.id,
                    plan: { id: plan.id, name: plan.name },
                    start_date: result.subscription.start_date,
                    end_date: result.subscription.end_date,
                    status: result.subscription.status,
                    auto_renew: result.subscription.auto_renew,
                },
                payment: {
                    id: result.payment.id,
                    amount: result.payment.amount,
                    status: result.payment.status,
                    external_transaction_id: result.payment.external_transaction_id,
                    payment_method: result.payment.payment_method,
                },
            },
        };
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map