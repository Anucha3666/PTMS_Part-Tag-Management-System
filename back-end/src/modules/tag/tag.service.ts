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
      const cachedTags = await this.cacheManager.get<TRESTag[]>('tags');
      if (cachedTags) {
        return {
          status: 'success',
          message: 'Tags retrieved from cache.',
          data: cachedTags,
        };
      }

      const tags = await this.tagModel
        .aggregate([
          {
            $sort: { created_at: -1 },
          },
          {
            $addFields: {
              part_id: { $toObjectId: '$part_id' },
            },
          },
          {
            $lookup: {
              from: 'parts',
              localField: 'part_id',
              foreignField: '_id',
              as: 'part_info',
            },
          },
          {
            $unwind: { path: '$part_info', preserveNullAndEmptyArrays: true },
          },
        ])
        .exec();

      await this?.tagHelper?.class?.isNoTagFound(!tags);

      const result = tags.map(this.tagHelper.map.res);
      await this.cacheManager.set('tags', result);

      return {
        status: 'success',
        message: 'Tags retrieved successfully.',
        data: [],
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async findOne(tag_no: string): Promise<ResponseFormat<TRESTag>> {
    try {
      const cachedTag = await this.cacheManager.get<TRESTag[]>(`tag_${tag_no}`);
      if (cachedTag) {
        return {
          status: 'success',
          message: 'Tag retrieved from cache.',
          data: cachedTag,
        };
      }

      const tag = await this.tagModel
        .aggregate([
          {
            $match: { tag_no: tag_no },
          },
          {
            $addFields: {
              part_id: { $toObjectId: '$part_id' },
            },
          },
          {
            $lookup: {
              from: 'parts',
              localField: 'part_id',
              foreignField: '_id',
              as: 'part_info',
            },
          },
          {
            $unwind: { path: '$part_info', preserveNullAndEmptyArrays: true },
          },
        ])
        .exec();

      if (!tag || tag.length === 0) {
        throw new Error('Tag not found');
      }

      const result = tag.map(this.tagHelper.map.res);

      await this.cacheManager.set(`tag_${tag_no}`, result);

      return {
        status: 'success',
        message: 'Tag retrieved successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
      return {
        status: 'error',
        message: error.message || 'An error occurred.',
        data: [],
      };
    }
  }

  async validationTagDaikin(tag_no: string): Promise<ResponseFormat<TRESTag>> {
    try {
      const cachedTag = await this.cacheManager.get<TRESTag[]>(`tag_${tag_no}`);
      if (cachedTag) {
        return {
          status: 'success',
          message: 'Tag retrieved from cache.',
          data: cachedTag,
        };
      }

      const tag = await this.tagModel
        .aggregate([
          {
            $match: { tag_no: tag_no },
          },
          {
            $addFields: {
              part_id: { $toObjectId: '$part_id' },
            },
          },
          {
            $lookup: {
              from: 'parts',
              localField: 'part_id',
              foreignField: '_id',
              as: 'part_info',
            },
          },
          {
            $unwind: { path: '$part_info', preserveNullAndEmptyArrays: true },
          },
        ])
        .exec();

      if (!tag || tag.length === 0) {
        throw new Error('Tag not found');
      }

      const result = tag.map(this.tagHelper.map.res);

      await this.cacheManager.set(`tag_${tag_no}`, result);

      return {
        status: 'success',
        message: 'Tag retrieved successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
      return {
        status: 'error',
        message: error.message || 'An error occurred.',
        data: [],
      };
    }
  }
}
