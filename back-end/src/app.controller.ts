import { HttpService } from '@nestjs/axios';
import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as FormData from 'form-data';
import { memoryStorage } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Post('upload-proxy')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file_packing', maxCount: 1 },
        { name: 'file_picture_std', maxCount: 1 },
        { name: 'file_profile', maxCount: 1 },
        { name: 'file_q_point', maxCount: 1 },
        { name: 'file_more_pictures', maxCount: 3 },
      ],
      {
        storage: memoryStorage(),
      },
    ),
  )
  async proxyUpload(
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
  ) {
    const formData = new FormData();
    const fileKeys = [
      'file_packing',
      'file_picture_std',
      'file_profile',
      'file_q_point',
      'file_more_pictures',
    ];

    console.log('test');

    for (const key of fileKeys) {
      const uploadedFiles = files[key];
      if (uploadedFiles) {
        for (const file of uploadedFiles) {
          formData.append('path', 'ptms/images/more_pictures');
          formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
          });

          try {
            const response = await this.httpService.axiosRef.post(
              'https://api-gateway-v1.sncformer.com/microservices/v1/file-management/upload/one',
              formData,
              {
                headers: {
                  ...formData.getHeaders(),
                  Authorization: `Bearer ${process.env.TOKEN_UPLODE_IMAGE}`,
                },
              },
            );

            return (
              response.data?.data?.[0]?.url ??
              'Upload success but no URL returned'
            );
          } catch (error) {
            throw new HttpException(
              error?.response?.data || 'Upload failed',
              error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        }
      }
    }

    throw new HttpException('No valid file uploaded', HttpStatus.BAD_REQUEST);
  }
}
