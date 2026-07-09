export interface TranscodeResult {
    outputPath: string;
    filename: string;
    sizeMb: number;
}
export declare class VideoService {
    private readonly logger;
    constructor();
    transcodeToQuality(inputPath: string, quality: string): Promise<TranscodeResult>;
}
