import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Movie App API')
  .setDescription("Kino ko'rish, sevimli kinolar, obuna va admin panel uchun backend API")
  .setVersion('1.0')
  .addBearerAuth() 
  .build();
