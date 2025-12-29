import { Inject, Injectable } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: typeof Cloudinary,
  ) {}

  // Upload a file to Cloudinary
  async uploadFile(file: Express.Multer.File, folder: string) {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'auto', // image, video, raw
          },
          (error, result) => {
            if (error) return reject(error as Error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  // Upload multiple files to Cloudinary
  async uploadFiles(files: Express.Multer.File[], folder: string) {
    return Promise.all(files.map((file) => this.uploadFile(file, folder)));
  }
}
