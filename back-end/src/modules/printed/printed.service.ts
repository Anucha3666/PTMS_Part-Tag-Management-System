import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { CommonHelper, PrintedHelper } from 'src/helpers';
import { TRESPrinted } from 'src/types';
import { ResponseFormat } from 'src/types/common';
import { Tag, TagDocument } from '../tag/tag.entity';
import { Printed, PrintedDocument } from './printed.entity';

@Injectable()
export class PrintedService {
  commonHelper = CommonHelper;
  printedHelper = PrintedHelper;

  constructor(
    @InjectModel(Printed.name) private printedModel: Model<PrintedDocument>,
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<ResponseFormat<TRESPrinted>> {
    try {
      const cachedPrinteds =
        await this.cacheManager.get<TRESPrinted[]>('printeds');
      if (cachedPrinteds) {
        return {
          status: 'success',
          message: 'Printeds retrieved from cache.',
          data: cachedPrinteds,
        };
      }

      const printeds = await this.printedModel
        .find({ is_log: { $ne: true } })
        .select('-is_log')
        .sort({ created_at: -1 })
        .lean()
        .exec();
      await this?.printedHelper?.class?.isNoPrintedFound(!printeds);

      const result = printeds.map(this.printedHelper.map.res);
      await this.cacheManager.set('printeds', result);

      return {
        status: 'success',
        message: 'Printeds retrieved successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }
}
