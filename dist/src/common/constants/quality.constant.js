"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LABEL_TO_QUALITY = exports.QUALITY_LABELS = void 0;
const client_1 = require("@prisma/client");
exports.QUALITY_LABELS = {
    Q240: '240p',
    Q360: '360p',
    Q480: '480p',
    Q720: '720p',
    Q1080: '1080p',
    Q4K: '4K',
};
exports.LABEL_TO_QUALITY = {
    '240p': client_1.VideoQuality.Q240,
    '360p': client_1.VideoQuality.Q360,
    '480p': client_1.VideoQuality.Q480,
    '720p': client_1.VideoQuality.Q720,
    '1080p': client_1.VideoQuality.Q1080,
    '4K': client_1.VideoQuality.Q4K,
};
//# sourceMappingURL=quality.constant.js.map