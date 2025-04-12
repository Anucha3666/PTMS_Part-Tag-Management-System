import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  readonly customer_name: string;

  @IsOptional()
  @IsString()
  readonly customer_description: string;

  @IsOptional()
  @IsString()
  readonly logo: string | null | Express.Multer.File;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly created_by: string;

  constructor(data: Partial<CreateCustomerDto>) {
    Object.assign(this, data);
  }

  static async format(
    data: Partial<CreateCustomerDto>,
  ): Promise<CreateCustomerDto> {
    const cleanData = {
      customer_name: data.customer_name,
      customer_description: data.customer_description,
      logo: data.logo ?? null,
      created_by: data?.created_by,
    };

    return plainToClass(CreateCustomerDto, cleanData);
  }
}

export class UpdateCustomerDto {
  @IsString()
  @IsNotEmpty()
  readonly customer_name: string;

  @IsOptional()
  @IsString()
  readonly customer_description: string;

  @IsOptional()
  @IsString()
  readonly logo: string | null | Express.Multer.File;

  constructor(data: Partial<UpdateCustomerDto>) {
    Object.assign(this, data);
  }

  static async format(
    data: Partial<UpdateCustomerDto>,
  ): Promise<UpdateCustomerDto> {
    const cleanData = {
      customer_name: data.customer_name,
      customer_description: data.customer_description,
      logo: data.logo ?? null,
      updated_at: new Date(),
    };

    return plainToClass(UpdateCustomerDto, cleanData);
  }
}
