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
