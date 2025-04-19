import { plainToClass } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  readonly part_no: string;

  @IsString()
  @IsNotEmpty()
  readonly part_name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly packing_std: number;

  @IsString()
  @IsNotEmpty()
  readonly customer_id: string;

  @IsOptional()
  @IsString()
  readonly picture_std: string | null | Express.Multer.File;

  @IsOptional()
  @IsString()
  readonly q_point: string | null | Express.Multer.File;

  @IsOptional()
  @IsString()
  readonly packing: string | null | Express.Multer.File;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly more_pictures: (string | null | Express.Multer.File)[];

  @IsOptional()
  @IsString()
  readonly created_by: string;

  constructor(data: Partial<CreatePartDto>) {
    Object.assign(this, data);
  }

  static async format(data: Partial<CreatePartDto>): Promise<CreatePartDto> {
    const cleanData = {
      part_no: data.part_no,
      part_name: data.part_name,
      packing_std: data.packing_std,
      customer_id: data.customer_id,
      picture_std: data.picture_std,
      q_point: data.q_point,
      packing: data.packing,
      more_pictures: data.more_pictures,
      created_by: data.created_by,
    };

    return plainToClass(CreatePartDto, cleanData);
  }
}

export class UpdatePartDto {
  @IsOptional()
  @IsString()
  readonly part_no: string;

  @IsString()
  @IsNotEmpty()
  readonly part_name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly packing_std: number;

  @IsString()
  @IsNotEmpty()
  readonly customer_id: string;

  @IsOptional()
  @IsString()
  readonly picture_std: string | null | Express.Multer.File;

  @IsOptional()
  @IsString()
  readonly q_point: string | null | Express.Multer.File;

  @IsOptional()
  @IsString()
  readonly packing: string | null | Express.Multer.File;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly more_pictures: (string | null | Express.Multer.File)[];

  @IsOptional()
  @IsString()
  readonly created_by: string;
}
