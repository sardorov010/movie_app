"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
exports.swaggerConfig = new swagger_1.DocumentBuilder()
    .setTitle('Movie App API')
    .setDescription("Kino ko'rish, sevimli kinolar, obuna va admin panel uchun backend API")
    .setVersion('1.0')
    .addBearerAuth()
    .build();
//# sourceMappingURL=swagger.js.map