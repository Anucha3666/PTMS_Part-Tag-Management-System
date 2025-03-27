// ValidatorUtils.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate as classValidate } from 'class-validator';

export class ValidatorUtils {
  static async validate(dto: any, req: any): Promise<void> {
    const plainDto = plainToClass(dto, req);
    const validationErrors = await classValidate(plainDto);

    if (validationErrors.length > 0) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Validation failed',
          data: validationErrors,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

// const buffer = await Buffer.from(base64String, 'base64');
// return buffer.toString('base64') === base64String;
export const isValidBase64 = (base64String: string): boolean => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  return matches !== null && matches.length > 1;
};
