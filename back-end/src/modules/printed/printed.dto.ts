import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePrintedDto {
  @IsString()
  @IsNotEmpty()
  readonly printed_by: string;

  constructor(data: Partial<CreatePrintedDto>) {
    Object.assign(this, data);
  }

  static async format(
    data: Partial<CreatePrintedDto>,
  ): Promise<CreatePrintedDto> {
    const cleanData = {
      printed_by: data.printed_by,
    };

    return plainToClass(CreatePrintedDto, cleanData);
  }
}
