import { plainToClass } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePrintDto {
  @IsString()
  @IsNotEmpty()
  readonly printed_by: string;

  @IsString()
  @IsArray()
  @IsNotEmpty()
  readonly part_ids: string[];

  constructor(data: Partial<CreatePrintDto>) {
    Object.assign(this, data);
  }

  static async format(data: Partial<CreatePrintDto>): Promise<CreatePrintDto> {
    const cleanData = {
      printed_by: data.printed_by,
      part_ids: data.part_ids ?? [],
    };

    return plainToClass(CreatePrintDto, cleanData);
  }
}
