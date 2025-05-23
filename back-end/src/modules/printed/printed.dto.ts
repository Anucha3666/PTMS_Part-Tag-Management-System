import { plainToClass, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TPrintedSummary } from 'src/types';

export class CreatePrintedDto {
  @IsString()
  @IsNotEmpty()
  readonly process: string;

  @IsString()
  @IsNotEmpty()
  readonly printed_by: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tags: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrintedSummaryDto)
  readonly summary: TPrintedSummary[];

  constructor(data: Partial<CreatePrintedDto>) {
    Object.assign(this, data);
  }

  static async format(
    data: Partial<CreatePrintedDto>,
  ): Promise<CreatePrintedDto> {
    const cleanData = {
      process: data.process,
      printed_by: data.printed_by,
    };

    return plainToClass(CreatePrintedDto, cleanData);
  }
}

export class PrintedSummaryDto {
  @IsString()
  @IsNotEmpty()
  part_id: string;

  @IsNumber()
  number_of_tags: number;
}
