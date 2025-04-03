import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { CommonHelper, TagHelper } from 'src/helpers';
import { TRESTag } from 'src/types';
import { ResponseFormat } from 'src/types/common';
import { Tag, TagDocument } from './tag.entity';

@Injectable()
export class TagService {
  commonHelper = CommonHelper;
  tagHelper = TagHelper;

  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<ResponseFormat<TRESTag>> {
    try {
      const cachedParts = await this.cacheManager.get<TRESTag[]>('parts');
      if (cachedParts) {
        return {
          status: 'success',
          message: 'Parts retrieved from cache.',
          data: cachedParts,
        };
      }

      const parts = await this.tagModel
        .find({ is_log: { $ne: true } })
        .select('-is_log')
        .sort({ created_at: -1 })
        .lean()
        .exec();
      await this?.tagHelper?.class?.isNoTagFound(!parts);

      const result = parts.map(this.tagHelper.map.res);
      await this.cacheManager.set('parts', result);

      return {
        status: 'success',
        message: 'Parts retrieved successfully.',
        data: [],
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async findOne(part_id: string): Promise<ResponseFormat<TRESTag>> {
    try {
      const CACHE_KEY = `part_by_part_id_${part_id}`;

      const cachedAccount = await this.cacheManager.get<TRESTag[]>(CACHE_KEY);
      if (cachedAccount) {
        return {
          status: 'success',
          message: 'Account retrieved from cache.',
          data: cachedAccount,
        };
      }

      const part = await this.tagModel
        .findOne({ _id: part_id, is_log: { $ne: true } })
        .select('-is_log')
        .sort({ created_at: -1 })
        .exec();
      await this?.tagHelper?.class?.isNoTagFound(!part);

      const result = [part].map(this.tagHelper.map.res);
      await this.cacheManager.set(CACHE_KEY, result);

      return {
        status: 'success',
        message: 'Part retrieved successfully.',
        data: [],
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }
}
