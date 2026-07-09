import { PrismaService } from '../../core/database/prisma.service';
import { PurchaseSubscriptionDto } from './dto/purchase-subscription.dto';
export declare class SubscriptionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPlans(): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            price: import("@prisma/client/runtime/client").Decimal;
            duration_days: number;
            features: import("@prisma/client/runtime/client").JsonValue;
        }[];
    }>;
    purchase(userId: string, payload: PurchaseSubscriptionDto): Promise<{
        success: boolean;
        message: string;
        data: {
            subscription: {
                id: string;
                plan: {
                    id: string;
                    name: string;
                };
                start_date: Date;
                end_date: Date | null;
                status: import("@prisma/client").$Enums.SubscriptionStatus;
                auto_renew: boolean;
            };
            payment: {
                id: string;
                amount: import("@prisma/client/runtime/client").Decimal;
                status: import("@prisma/client").$Enums.PaymentStatus;
                external_transaction_id: string | null;
                payment_method: import("@prisma/client").$Enums.PaymentMethod;
            };
        };
    }>;
}
