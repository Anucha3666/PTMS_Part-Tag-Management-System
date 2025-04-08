import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  readonly printed_id: string;

  @IsString()
  @IsNotEmpty()
  readonly part_id: string;

  @IsString()
  @IsNotEmpty()
  readonly tag_no: string;

  constructor(data: Partial<CreateTagDto>) {
    Object.assign(this, data);
  }

  static async format(data: Partial<CreateTagDto>): Promise<CreateTagDto> {
    const cleanData = {
      printed_id: data.printed_id,
      part_id: data.part_id,
      tag_no: data.tag_no,
    };

    return plainToClass(CreateTagDto, cleanData);
  }
}

export class ValidationTagDto {
  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @IsString()
  @IsNotEmpty()
  readonly ref_tag: string;

  @IsString()
  @IsNotEmpty()
  readonly tag_no: string;

  @IsString()
  @IsNotEmpty()
  readonly checked_by: string;

  constructor(data: Partial<ValidationTagDto>) {
    Object.assign(this, data);
  }

  static async format(
    data: Partial<ValidationTagDto>,
  ): Promise<ValidationTagDto> {
    const cleanData = {
      tag_no: data.tag_no,
      ref_tag: data.ref_tag,
      checked_by: data.checked_by,
      checked_at: new Date(),
    };

    return plainToClass(ValidationTagDto, cleanData);
  }
}
