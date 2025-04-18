import { plainToClass, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TPrintedSummary } from 'src/types';
import { CreatePrintedDto, PrintedSummaryDto } from '../printed/printed.dto';
import { Tag } from '../tag/tag.entity';

export class CreatePrintDto {
  @IsOptional()
  @IsString()
  readonly process: string;

  @IsString()
  @IsNotEmpty()
  readonly print_by: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrintedSummaryDto)
  readonly parts: TPrintedSummary[];

  constructor(data: Partial<CreatePrintDto>) {
    Object.assign(this, data);
  }

  static async formatCreatePrinted(
    data: Partial<CreatePrintDto>,
  ): Promise<CreatePrintedDto> {
    const cleanData = {
      process: data.process,
      printed_by: data.print_by,
      tags: [],
      summary: data?.parts,
    };

    return plainToClass(CreatePrintedDto, cleanData);
  }

  static async formatCreateTags(printedId: string, parts: TPrintedSummary[]) {
    const tagsToCreate: Omit<
      Tag,
      '_id' | 'ref_tag' | 'checked_by' | 'checked_at'
    >[] = [];

    for (const part of parts) {
      for (let i = 1; i <= part.number_of_tags; i++) {
        tagsToCreate.push({
          printed_id: printedId,
          part_id: part.part_id,
          tag_no: '',
        });
      }
    }

    return tagsToCreate;
  }
}
