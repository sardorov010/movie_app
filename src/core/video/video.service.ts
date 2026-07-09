import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { existsSync, statSync } from 'fs';
import { join, parse } from 'path';

/**
 * Har bir sifat darajasi uchun videoning balandligi (px) va bitrate qiymatlari.
 * Kenglik "-2" qilib beriladi - ffmpeg proporsiyani saqlab, kenglikni o'zi hisoblaydi.
 */
const QUALITY_PRESETS: Record<string, { height: number; videoBitrate: string; audioBitrate: string }> = {
  '240p': { height: 240, videoBitrate: '400k', audioBitrate: '64k' },
  '360p': { height: 360, videoBitrate: '800k', audioBitrate: '96k' },
  '480p': { height: 480, videoBitrate: '1200k', audioBitrate: '128k' },
  '720p': { height: 720, videoBitrate: '2500k', audioBitrate: '128k' },
  '1080p': { height: 1080, videoBitrate: '5000k', audioBitrate: '192k' },
  '4K': { height: 2160, videoBitrate: '15000k', audioBitrate: '192k' },
};

export interface TranscodeResult {
  outputPath: string;
  filename: string;
  sizeMb: number;
}

/**
 * VideoService - fluent-ffmpeg kutubxonasi orqali videolarni qayta ishlaydi.
 *
 * fluent-ffmpeg o'zi video ishlamaydi - u kompyuterda o'rnatilgan "ffmpeg" dasturini
 * (dunyodagi eng mashhur video protsessor) chaqiruvchi qulay Node.js "o'ram" (wrapper).
 * ffmpeg'ni alohida o'rnatmaslik uchun "ffmpeg-static" paketi ishlatilgan - u
 * npm install paytida ffmpeg binariyasini o'zi yuklab keladi.
 */
@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  constructor() {
    // fluent-ffmpeg'ga ffmpeg binariyasi qayerdaligini ko'rsatamiz
    if (ffmpegStatic) {
      ffmpeg.setFfmpegPath(ffmpegStatic as unknown as string);
    }
  }

  /**
   * Yuklangan videoni berilgan sifatga (masalan "720p") o'tkazadi (transcode).
   *
   * Qanday ishlaydi:
   * 1. QUALITY_PRESETS dan balandlik va bitrate olinadi
   * 2. ffmpeg video razmerini o'zgartiradi (scale), H.264 video + AAC audio kodeklariga o'tkazadi
   * 3. Natija <asl-nom>-<sifat>.mp4 ko'rinishida saqlanadi
   * 4. Asl (original) fayl o'chirilmaydi - kerak bo'lsa boshqa sifatlarga ham o'tkazish uchun qoladi
   *
   * Eslatma: bu metod await qilinadi, ya'ni katta fayllar uchun so'rov uzoq davom etishi mumkin.
   * Haqiqiy production loyihada bu ish navbat (queue, masalan BullMQ) orqali fonda bajariladi.
   */
  async transcodeToQuality(inputPath: string, quality: string): Promise<TranscodeResult> {
    const preset = QUALITY_PRESETS[quality];
    if (!preset) {
      throw new InternalServerErrorException(`Noma'lum sifat darajasi: ${quality}`);
    }

    if (!existsSync(inputPath)) {
      throw new InternalServerErrorException('Kirish video fayli topilmadi!');
    }

    const parsed = parse(inputPath);
    const outputFilename = `${parsed.name}-${quality}.mp4`;
    const outputPath = join(parsed.dir, outputFilename);

    this.logger.log(`Transcode boshlandi: ${parsed.base} -> ${quality}`);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        // Videoni H.264 (eng keng qo'llab-quvvatlanadigan) kodekka o'tkazamiz
        .videoCodec('libx264')
        // Audio - AAC
        .audioCodec('aac')
        // Balandlikni sozlaymiz, kenglik (-2) proporsional hisoblanadi va juft son bo'ladi
        .size(`?x${preset.height}`)
        .videoBitrate(preset.videoBitrate)
        .audioBitrate(preset.audioBitrate)
        // "faststart" - video internetda darhol (to'liq yuklanmasdan) o'ynay boshlashi uchun
        .outputOptions(['-movflags', '+faststart', '-preset', 'fast'])
        .on('progress', (p) => {
          if (p.percent) {
            this.logger.log(`Transcode jarayoni: ${Math.round(p.percent)}%`);
          }
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .save(outputPath);
    }).catch((err) => {
      this.logger.error(`Transcode xatosi: ${err.message}`);
      throw new InternalServerErrorException('Video qayta ishlashda xatolik yuz berdi!');
    });

    const sizeMb = Math.round(statSync(outputPath).size / (1024 * 1024));
    this.logger.log(`Transcode tugadi: ${outputFilename} (${sizeMb} MB)`);

    return { outputPath, filename: outputFilename, sizeMb };
  }
}
