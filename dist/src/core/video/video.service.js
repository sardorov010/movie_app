"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var VideoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const fs_1 = require("fs");
const path_1 = require("path");
const QUALITY_PRESETS = {
    '240p': { height: 240, videoBitrate: '400k', audioBitrate: '64k' },
    '360p': { height: 360, videoBitrate: '800k', audioBitrate: '96k' },
    '480p': { height: 480, videoBitrate: '1200k', audioBitrate: '128k' },
    '720p': { height: 720, videoBitrate: '2500k', audioBitrate: '128k' },
    '1080p': { height: 1080, videoBitrate: '5000k', audioBitrate: '192k' },
    '4K': { height: 2160, videoBitrate: '15000k', audioBitrate: '192k' },
};
let VideoService = VideoService_1 = class VideoService {
    logger = new common_1.Logger(VideoService_1.name);
    constructor() {
        if (ffmpeg_static_1.default) {
            fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
        }
    }
    async transcodeToQuality(inputPath, quality) {
        const preset = QUALITY_PRESETS[quality];
        if (!preset) {
            throw new common_1.InternalServerErrorException(`Noma'lum sifat darajasi: ${quality}`);
        }
        if (!(0, fs_1.existsSync)(inputPath)) {
            throw new common_1.InternalServerErrorException('Kirish video fayli topilmadi!');
        }
        const parsed = (0, path_1.parse)(inputPath);
        const outputFilename = `${parsed.name}-${quality}.mp4`;
        const outputPath = (0, path_1.join)(parsed.dir, outputFilename);
        this.logger.log(`Transcode boshlandi: ${parsed.base} -> ${quality}`);
        await new Promise((resolve, reject) => {
            (0, fluent_ffmpeg_1.default)(inputPath)
                .videoCodec('libx264')
                .audioCodec('aac')
                .size(`?x${preset.height}`)
                .videoBitrate(preset.videoBitrate)
                .audioBitrate(preset.audioBitrate)
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
            throw new common_1.InternalServerErrorException('Video qayta ishlashda xatolik yuz berdi!');
        });
        const sizeMb = Math.round((0, fs_1.statSync)(outputPath).size / (1024 * 1024));
        this.logger.log(`Transcode tugadi: ${outputFilename} (${sizeMb} MB)`);
        return { outputPath, filename: outputFilename, sizeMb };
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = VideoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], VideoService);
//# sourceMappingURL=video.service.js.map