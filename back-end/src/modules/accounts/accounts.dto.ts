import { Exclude, plainToClass } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BcryptUtils } from 'src/utils';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  readonly employee_number: string;

  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly role?: string | null;

  @IsOptional()
  @IsString()
  readonly profile_picture?: string | null;

  @IsOptional()
  @IsDate()
  readonly created_at?: Date;

  @IsOptional()
  @IsDate()
  readonly updated_at?: Date;

  constructor(data: Partial<CreateAccountDto>) {
    Object.assign(this, data);
  }

  static async createWithHashedPassword(
    data: Partial<CreateAccountDto>,
  ): Promise<CreateAccountDto> {
    const hashedPassword = await BcryptUtils.hashPassword(data.password);
    return plainToClass(CreateAccountDto, {
      ...data,
      password: hashedPassword,
    });
  }
}

export class UpdateAccountDto {
  @Exclude()
  @IsOptional()
  @IsString()
  readonly employee_number?: string;

  @IsOptional()
  @IsString()
  readonly first_name?: string;

  @IsOptional()
  @IsString()
  readonly last_name?: string;

  @Exclude()
  @IsOptional()
  @IsString()
  readonly username: string;

  @Exclude()
  @IsOptional()
  @IsString()
  readonly password: string;

  @Exclude()
  @IsString()
  @IsOptional()
  readonly role: string | null;

  @IsOptional()
  @IsString()
  readonly profile_picture?: string | null;

  @Exclude()
  @IsOptional()
  @IsDate()
  readonly created_at?: Date;

  @IsOptional()
  @IsDate()
  readonly updated_at?: Date;

  constructor(data: Partial<UpdateAccountDto>) {
    Object.assign(this, data);
  }

  static async createWithUpdatedAt(
    data: Partial<UpdateAccountDto>,
  ): Promise<UpdateAccountDto> {
    return plainToClass(UpdateAccountDto, { ...data, updated_at: new Date() });
  }
}
