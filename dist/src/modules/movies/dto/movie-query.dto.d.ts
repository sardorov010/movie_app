import { SubscriptionType } from '@prisma/client';
export declare class MovieQueryDto {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    subscription_type?: SubscriptionType;
}
