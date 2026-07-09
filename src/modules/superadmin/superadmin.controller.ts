import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SuperadminService } from './superadmin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';

@ApiTags('Superadmin')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.SUPERADMIN) 
@Controller('superadmin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}


  @ApiOperation({ summary: "Adminlar ro'yxati (GET /api/superadmin/admins)" })
  @Get('admins')
  findAllAdmins() {
    return this.superadminService.findAllAdmins();
  }

  @ApiOperation({ summary: 'Yangi admin yaratish (POST /api/superadmin/admins)' })
  @Post('admins')
  createAdmin(@Body() payload: CreateAdminDto) {
    return this.superadminService.createAdmin(payload);
  }

  @ApiOperation({ summary: "Admin huquqlarini olib tashlash (DELETE /api/superadmin/admins/:id)" })
  @Delete('admins/:id')
  removeAdmin(@Param('id') id: string) {
    return this.superadminService.removeAdmin(id);
  }


  @ApiOperation({ summary: "Barcha rejalar, nofaollari bilan (GET /api/superadmin/plans)" })
  @Get('plans')
  findAllPlans() {
    return this.superadminService.findAllPlans();
  }

  @ApiOperation({ summary: 'Yangi obuna rejasi yaratish (POST /api/superadmin/plans)' })
  @Post('plans')
  createPlan(@Body() payload: CreatePlanDto) {
    return this.superadminService.createPlan(payload);
  }

  @ApiOperation({ summary: 'Rejani yangilash (PUT /api/superadmin/plans/:id)' })
  @Put('plans/:id')
  updatePlan(@Param('id') id: string, @Body() payload: UpdatePlanDto) {
    return this.superadminService.updatePlan(id, payload);
  }

  @ApiOperation({ summary: "Rejani o'chirish - soft delete (DELETE /api/superadmin/plans/:id)" })
  @Delete('plans/:id')
  deactivatePlan(@Param('id') id: string) {
    return this.superadminService.deactivatePlan(id);
  }
}
