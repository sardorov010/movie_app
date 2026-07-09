import { SuperadminService } from './superadmin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';
export declare class SuperadminController {
    private readonly superadminService;
    constructor(superadminService: SuperadminService);
    findAllAdmins(): Promise<{
        success: boolean;
        data: {
            admins: {
                id: string;
                username: string;
                email: string;
                created_at: Date;
            }[];
            total: number;
        };
    }>;
    createAdmin(payload: CreateAdminDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            username: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            created_at: Date;
        };
    }>;
    removeAdmin(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findAllPlans(): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            price: import("@prisma/client/runtime/client").Decimal;
            duration_days: number;
            features: import("@prisma/client/runtime/client").JsonValue;
            is_active: boolean;
        }[];
    }>;
    createPlan(payload: CreatePlanDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            price: import("@prisma/client/runtime/client").Decimal;
            duration_days: number;
            features: import("@prisma/client/runtime/client").JsonValue;
            is_active: boolean;
        };
    }>;
    updatePlan(id: string, payload: UpdatePlanDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            price: import("@prisma/client/runtime/client").Decimal;
            duration_days: number;
            features: import("@prisma/client/runtime/client").JsonValue;
            is_active: boolean;
        };
    }>;
    deactivatePlan(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
