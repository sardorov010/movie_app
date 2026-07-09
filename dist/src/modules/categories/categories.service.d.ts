import { PrismaService } from '../../core/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            description: string | null;
            slug: string;
        }[];
    }>;
    create(payload: CreateCategoryDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            description: string | null;
            slug: string;
        };
    }>;
    update(id: string, payload: UpdateCategoryDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            description: string | null;
            slug: string;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
