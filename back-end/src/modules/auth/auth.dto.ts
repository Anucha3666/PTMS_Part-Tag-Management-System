import { TRole } from 'src/types';

export class SignInDto {
  readonly username: string;
  readonly password: string;
}

export class SignUpDto {
  readonly employee_number: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly username: string;
  readonly password: string;
  readonly role: TRole;
  readonly profile_picture?: string | null;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}

export class ChangeRoleDto {
  readonly account_id: string;
  readonly role: TRole;
}

export class ChangePasswordDto {
  readonly password: string;
  readonly new_password: string;
}

export class ResetPasswordDto {
  readonly account_id: string;
}
