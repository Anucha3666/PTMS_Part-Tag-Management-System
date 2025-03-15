import { plainToClass } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TRole } from 'src/types';
import { BcryptUtils } from 'src/utils';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class SignUpDto {
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

  @IsOptional()
  @IsDate()
  readonly created_at?: Date;

  @IsOptional()
  @IsDate()
  readonly updated_at?: Date;

  constructor(data: Partial<SignUpDto>) {
    Object.assign(this, data);
  }

  static async createWithHashedPassword(
    data: Partial<SignUpDto>,
  ): Promise<SignUpDto> {
    const hashedPassword = await BcryptUtils.hashPassword(data.password);
    return plainToClass(SignUpDto, {
      ...data,
      password: hashedPassword,
      role: null,
    });
  }
}

export class ChangeRoleDto {
  @IsString()
  readonly role: TRole;

  @IsOptional()
  @IsDate()
  readonly updated_at?: Date;

  constructor(data: Partial<ChangeRoleDto>) {
    Object.assign(this, data);
  }

  static async changeWithRole(
    data: Partial<ChangeRoleDto>,
  ): Promise<ChangeRoleDto> {
    return plainToClass(ChangeRoleDto, {
      role: data?.role,
      updated_at: new Date(),
    });
  }
}

export class ChangePasswordDto {
  readonly password: string;
  readonly new_password: string;
}

export class ResetPasswordDto {
  readonly account_id: string;
}
