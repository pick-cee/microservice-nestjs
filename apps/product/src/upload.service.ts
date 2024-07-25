import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    fileName: Express.Multer.File | any,
  ): Promise<UploadApiResponse | UploadApiErrorResponse | string> {
    return new Promise(async (resolve, reject) => {
      v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      });
      toStream(fileName.buffer).pipe(upload);
    });
  }
}
