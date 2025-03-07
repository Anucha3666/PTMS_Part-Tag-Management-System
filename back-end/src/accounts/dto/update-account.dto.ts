export class UpdateAccountDto {
  readonly employee_id?: string;
  readonly name?: string;
  readonly section?: string;
  readonly position?: string;
  readonly description?: string;
  readonly company?: string;
  readonly auth: string;

  readonly on_line_at?: Date;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}
