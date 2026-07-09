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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMovieFileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddMovieFileDto {
    quality;
    language;
}
exports.AddMovieFileDto = AddMovieFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '720p', enum: ['240p', '360p', '480p', '720p', '1080p', '4K'] }),
    (0, class_validator_1.IsIn)(['240p', '360p', '480p', '720p', '1080p', '4K']),
    __metadata("design:type", String)
], AddMovieFileDto.prototype, "quality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uz', default: 'uz' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddMovieFileDto.prototype, "language", void 0);
//# sourceMappingURL=add-movie-file.dto.js.map