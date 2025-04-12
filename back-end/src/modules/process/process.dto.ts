import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProcessDto {
  @IsString()
  @IsNotEmpty()
  readonly process_name: string;

  @IsOptional()
  @IsString()
  readonly process_description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly created_by: string;

  constructor(data: Partial<CreateProcessDto>) {
    Object.assign(this, data);
  }

  static async format(
    data: Partial<CreateProcessDto>,
  ): Promise<CreateProcessDto> {
    const cleanData = {
      process_name: data.process_name,
      process_description: data.process_description,
      created_by: data?.created_by,
    };

    return plainToClass(CreateProcessDto, cleanData);
  }
}

export class UpdateProcessDto {
  @IsString()
  @IsNotEmpty()
  readonly process_name: string;

  @IsOptional()
  @IsString()
  readonly process_description: string;

  constructor(data: Partial<UpdateProcessDto>) {
    Object.assign(this, data);
  }

  static async format(
    data: Partial<UpdateProcessDto>,
  ): Promise<UpdateProcessDto> {
    const cleanData = {
      process_name: data.process_name,
      process_description: data.process_description,
      updated_at: new Date(),
    };

    return plainToClass(UpdateProcessDto, cleanData);
  }
}
