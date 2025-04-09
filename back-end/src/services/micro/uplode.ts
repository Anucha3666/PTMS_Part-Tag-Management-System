import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';

type TRESUploadFile = {
  uploaded: boolean;
  name: string;
  path: string;
  url: string;
};
@Injectable()
export class MicroServiceUplode {
  constructor(private readonly httpService: HttpService) {}

  async uploadFile(
    path: string,
    file: Express.Multer.File,
  ): Promise<TRESUploadFile> {
    const formData = new FormData();
    formData.append('path', path);
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

      const res = response.data?.data?.[0];
      return {
        uploaded: res?.uploaded,
        name: String(res?.path)?.split('/')?.slice(-1)[0] ?? '',
        path: res?.path,
        url: res?.url,
      };
    } catch (error) {
      console.error('Upload failed with error: ', error);
      throw new HttpException(
        error?.response?.data || 'Upload failed',
        error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleFileUpload(files: { [key: string]: Express.Multer.File[] }) {
    const profilePicture = files['profile_picture']
      ? files['profile_picture'][0]
      : null;

    if (profilePicture) {
      const fileUrl = await this.uploadFile(
        'ptms/images/profile',
        profilePicture,
      );
      return fileUrl;
    }

    return 'No profile picture uploaded';
  }
}
