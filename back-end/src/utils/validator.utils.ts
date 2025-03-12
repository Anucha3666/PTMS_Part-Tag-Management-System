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
