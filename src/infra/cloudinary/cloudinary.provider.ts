import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    cloudinary.config({
      cloud_name: config.get('infra.cloudinary.cloudName'),
      api_key: config.get('infra.cloudinary.apiKey'),
      api_secret: config.get('infra.cloudinary.apiSecret'),
    });

    return cloudinary;
  },
};
