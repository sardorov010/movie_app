import { SubscriptionType } from '@prisma/client';
export declare class CreateMovieDto {
    title: string;
    description: string;
    release_year: number;
    duration_minutes: number;
    subscription_type: SubscriptionType;
    category_ids: string[];
}
