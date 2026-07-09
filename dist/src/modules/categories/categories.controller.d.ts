import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            description: string | null;
            slug: string;
        }[];
    }>;
}
export declare class AdminCategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
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
