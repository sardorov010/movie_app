import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../core/utils/jwt';
import { WatchHistoryService } from './watch-history.service';
import { SaveProgressDto } from './dto/save-progress.dto';

@ApiTags('Watch History')
@ApiBearerAuth()
@UseGuards(AuthGuard) 
@Controller('watch-history')
export class WatchHistoryController {
  constructor(private readonly watchHistoryService: WatchHistoryService) {}

  @ApiOperation({ summary: "Ko'rish tarixi ro'yxati (GET /api/watch-history) - 'Davom ettirish' bo'limi uchun" })
  @Get()
  getMyHistory(@CurrentUser() user: JwtPayload) {
    return this.watchHistoryService.getMyHistory(user.id);
  }

  @ApiOperation({ summary: "Ko'rish progressini saqlash (POST /api/watch-history) - video player yuboradi" })
  @Post()
  saveProgress(@CurrentUser() user: JwtPayload, @Body() payload: SaveProgressDto) {
    return this.watchHistoryService.saveProgress(user.id, payload);
  }

  @ApiOperation({ summary: "Kinoni tarixdan o'chirish (DELETE /api/watch-history/:movie_id)" })
  @Delete(':movie_id')
  remove(@CurrentUser() user: JwtPayload, @Param('movie_id') movieId: string) {
    return this.watchHistoryService.remove(user.id, movieId);
  }
}
