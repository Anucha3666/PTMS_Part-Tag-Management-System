import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TRole } from 'src/types';
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
  readonly role: TRole;

  @IsOptional()
  @IsString()
  readonly position: string;

  @IsOptional()
  @IsString()
  readonly profile_picture: string | null | Express.Multer.File;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly approved_by: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly created_by: string;

  constructor(data: Partial<CreateAccountDto>) {
    Object.assign(this, data);
  }

  static async format(
    data: Partial<CreateAccountDto>,
  ): Promise<CreateAccountDto> {
    const hashedPassword = await BcryptUtils.hashPassword(data.password);
    const cleanData = {
      employee_number: data.employee_number,
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      password: hashedPassword,
      role: data.role,
      position: data.position,
      profile_picture: data.profile_picture ?? null,
      created_by: data?.created_by,
      is_approved: true,
      approved_by: data?.approved_by,
      approved_at: new Date(),
    };

    return plainToClass(CreateAccountDto, cleanData);
  }
}

export class ChangeRoleDto {
  @IsString()
  readonly role: TRole;

  constructor(data: Partial<ChangeRoleDto>) {
    Object.assign(this, data);
  }

  static async changeWithRole(
    data: Partial<ChangeRoleDto>,
  ): Promise<ChangeRoleDto> {
    const cleanData = {
      role: data?.role,
      updated_at: new Date(),
    };

    return plainToClass(ChangeRoleDto, cleanData);
  }
}

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  readonly first_name: string;

  @IsOptional()
  @IsString()
  readonly last_name: string;

  @IsOptional()
  @IsString()
  readonly position: string;

  @IsOptional()
  @IsString()
  readonly profile_picture: string | null | Express.Multer.File;

  constructor(data: Partial<UpdateAccountDto>) {
    Object.assign(this, data);
  }

  static async format(
    data: Partial<UpdateAccountDto>,
  ): Promise<UpdateAccountDto> {
    const cleanData = {
      first_name: data.first_name,
      last_name: data.last_name,
      position: data.position,
      profile_picture: data.profile_picture,
      updated_at: new Date(),
    };

    return plainToClass(UpdateAccountDto, cleanData);
  }
}
