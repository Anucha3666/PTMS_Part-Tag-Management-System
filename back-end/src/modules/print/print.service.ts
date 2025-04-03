import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { CommonHelper, PrintedHelper } from 'src/helpers';
import { TRESPrinted } from 'src/types';
import { ResponseFormat } from 'src/types/common';
import { ValidatorUtils } from 'src/utils';
import { CreatePrintedDto } from '../printed/printed.dto';
import { Printed, PrintedDocument } from '../printed/printed.entity';
import { Tag, TagDocument } from '../tag/tag.entity';
import { CreatePrintDto } from './print.dto';

@Injectable()
export class PrintService {
  commonHelper = CommonHelper;
  printedHelper = PrintedHelper;

  constructor(
    @InjectModel(Printed.name) private printedModel: Model<PrintedDocument>,
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async printTags(
    req: CreatePrintDto,
  ): Promise<ResponseFormat<PrintedDocument | TRESPrinted>> {
    try {
      await ValidatorUtils.validate(CreatePrintedDto, req);

      const dto = await CreatePrintedDto.format(req);
      const part = new this.printedModel(dto);
      const savedPart = await part.save();
      const result = [savedPart?.toObject()].map(this.printedHelper.map.res);

      await this.cacheManager.del('printed');
      await this.cacheManager.del(
        `printed_by_printed_id_${result[0]?.printed_id}`,
      );

      return {
        status: 'success',
        message: 'Part created successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }
}
