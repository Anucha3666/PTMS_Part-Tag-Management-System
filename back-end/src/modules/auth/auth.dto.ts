import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
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
    });
  }
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly new_password: string;
}

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly employee_number: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;
}
