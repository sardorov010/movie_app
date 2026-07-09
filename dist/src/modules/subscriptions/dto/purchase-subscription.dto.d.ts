import { PaymentMethod } from '@prisma/client';
export declare class PurchaseSubscriptionDto {
    plan_id: string;
    payment_method: PaymentMethod;
    auto_renew?: boolean;
    payment_details?: Record<string, any>;
}
