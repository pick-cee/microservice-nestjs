import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import toStream = require('buffer-to-stream');

@Injectable()
export class UploadService {
    constructor(
        private readonly configSvc: ConfigService
    ) { }
    async uploadImage(
        fileName: Express.Multer.File | any
    ): Promise<UploadApiResponse | UploadApiErrorResponse | string> {
        return new Promise(async (reject, resolve) => {
            try {
                await v2.config({
                    cloud_name: this.configSvc.get<string>('CLOUDINARY_NAME'),
                    api_key: this.configSvc.get<string>('CLOUDINARY_API_KEY'),
                    api_secret: this.configSvc.get<string>('CLOUDINARY_API_SECRET'),
                    secure: true
                });
                const upload = v2.uploader.upload_stream((error, result) => {
                    if (error) return reject(error);
                    return resolve(result.secure_url);
                });
                toStream(fileName.buffer).pipe(upload);
            }
            catch (err) {
                console.log('Upload service', err)
                throw err
            }


        })
    }
}