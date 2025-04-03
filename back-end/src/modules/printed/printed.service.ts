import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { CommonHelper, PrintedHelper } from 'src/helpers';
import { TRESPrinted } from 'src/types';
import { ResponseFormat } from 'src/types/common';
import { ValidatorUtils } from 'src/utils';
import { Tag, TagDocument } from '../tag/tag.entity';
import { CreatePrintedDto } from './printed.dto';
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

  async create(
    req: CreatePrintedDto,
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

  async findAll(): Promise<ResponseFormat<TRESPrinted>> {
    try {
      const cachedParts = await this.cacheManager.get<TRESPrinted[]>('parts');
      if (cachedParts) {
        return {
          status: 'success',
          message: 'Parts retrieved from cache.',
          data: cachedParts,
        };
      }

      const parts = await this.printedModel
        .find({ is_log: { $ne: true } })
        .select('-is_log')
        .sort({ created_at: -1 })
        .lean()
        .exec();
      await this?.printedHelper?.class?.isNoPrintedFound(!parts);

      const result = parts.map(this.printedHelper.map.res);
      await this.cacheManager.set('parts', result);

      return {
        status: 'success',
        message: 'Parts retrieved successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async findOne(part_id: string): Promise<ResponseFormat<TRESPrinted>> {
    try {
      const CACHE_KEY = `part_by_part_id_${part_id}`;

      const cachedAccount =
        await this.cacheManager.get<TRESPrinted[]>(CACHE_KEY);
      if (cachedAccount) {
        return {
          status: 'success',
          message: 'Account retrieved from cache.',
          data: cachedAccount,
        };
      }

      const part = await this.printedModel
        .findOne({ _id: part_id, is_log: { $ne: true } })
        .select('-is_log')
        .sort({ created_at: -1 })
        .exec();
      await this?.printedHelper?.class?.isNoPrintedFound(!part);

      const result = [part].map(this.printedHelper.map.res);
      await this.cacheManager.set(CACHE_KEY, result);

      return {
        status: 'success',
        message: 'Part retrieved successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }
}
