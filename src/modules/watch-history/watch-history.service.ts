import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SaveProgressDto } from './dto/save-progress.dto';


@Injectable()
export class WatchHistoryService {
  constructor(private readonly prisma: PrismaService) {}


  async saveProgress(userId: string, payload: SaveProgressDto) {
    const movie = await this.prisma.movie.findUnique({ where: { id: payload.movie_id } });
    if (!movie) {
      throw new NotFoundException('Kino topilmadi!');
    }

    const history = await this.prisma.watchHistory.upsert({
      where: {
        user_id_movie_id: { user_id: userId, movie_id: payload.movie_id },
      },
      create: {
        user_id: userId,
        movie_id: payload.movie_id,
        watched_duration: payload.watched_duration,
        watched_percentage: payload.watched_percentage,
      },
      update: {
        watched_duration: payload.watched_duration,
        watched_percentage: payload.watched_percentage,
        last_watched: new Date(),
      },
    });

    return {
      success: true,
      message: "Ko'rish jarayoni saqlandi",
      data: {
        movie_id: history.movie_id,
        watched_duration: history.watched_duration,
        watched_percentage: history.watched_percentage,
        last_watched: history.last_watched,
      },
    };
  }

  async getMyHistory(userId: string) {
    const history = await this.prisma.watchHistory.findMany({
      where: { user_id: userId },
      include: { movie: true },
      orderBy: { last_watched: 'desc' },
    });

    return {
      success: true,
      data: {
        movies: history.map((h) => ({
          movie: {
            id: h.movie.id,
            title: h.movie.title,
            slug: h.movie.slug,
            poster_url: h.movie.poster_url,
            duration_minutes: h.movie.duration_minutes,
          },
          watched_duration: h.watched_duration,
          watched_percentage: h.watched_percentage,
          last_watched: h.last_watched,
        })),
        total: history.length,
      },
    };
  }

  async remove(userId: string, movieId: string) {
    const record = await this.prisma.watchHistory.findUnique({
      where: { user_id_movie_id: { user_id: userId, movie_id: movieId } },
    });

    if (!record) {
      throw new NotFoundException("Bu kino ko'rish tarixida topilmadi!");
    }

    await this.prisma.watchHistory.delete({ where: { id: record.id } });

    return {
      success: true,
      message: "Kino ko'rish tarixidan o'chirildi",
    };
  }
}
