export declare class CreatePlanDto {
    name: string;
    price: number;
    duration_days: number;
    features: string[];
    is_active?: boolean;
}
declare const UpdatePlanDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePlanDto>>;
export declare class UpdatePlanDto extends UpdatePlanDto_base {
}
export {};
