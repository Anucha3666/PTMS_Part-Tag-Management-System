import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import * as dayjs from 'dayjs';
import { Model } from 'mongoose';
import { CommonHelper, TagHelper } from 'src/helpers';
import { TRESTag, TRESTagValidation } from 'src/types';
import { ResponseFormat } from 'src/types/common';
import { ValidatorUtils } from 'src/utils';
import { ValidationTagDto } from './tag.dto';
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

      const result = await this.tagHelper?.class?.findTagsAndJoinPartAndPrinted(
        this?.tagModel,
      );

      await this?.tagHelper?.class?.isNoTagFound(!result);

      await this.cacheManager.set('tags', result);

      return {
        status: 'success',
        message: 'Tags retrieved successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async findOne(
    tag_no: string,
    tag_id: string,
  ): Promise<ResponseFormat<TRESTag>> {
    try {
      const cachedTag = await this.cacheManager.get<TRESTag>(`tag_${tag_no}`);
      if (cachedTag) {
        await this?.tagHelper?.class?.isNoTagFound(
          cachedTag?.tag_id !== tag_id,
        );
        return {
          status: 'success',
          message: 'Tag retrieved from cache.',
          data: [cachedTag],
        };
      }

      const result =
        await this?.tagHelper?.class?.findTagAndJoinPartAndPrintedAndAccountByTagNo(
          this.tagModel,
          tag_no,
        );

      await this?.tagHelper?.class?.isNoTagFound(result?.tag_id !== tag_id);
      await this.cacheManager.set(`tag_${tag_no}`, result);

      return {
        status: 'success',
        message: 'Tag retrieved successfully.',
        data: [result],
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

  async validationTagDaikin(
    req: ValidationTagDto,
  ): Promise<ResponseFormat<TRESTagValidation>> {
    try {
      await ValidatorUtils.validate(ValidationTagDto, req);

      const existingTag =
        await this?.tagHelper?.class?.findTagAndJoinPartAndPrintedByTagNo(
          this.tagModel,
          req?.tag_no,
        );

      await this?.tagHelper?.class?.isNoTagFound(!existingTag);

      if (existingTag?.checked_at) {
        const formattedDate = dayjs(existingTag.checked_at).format(
          'DD/MM/YYYY HH:mm',
        );
        this.commonHelper.httpExceptionError(
          `Tag already validated at ${formattedDate}`,
        );
      }

      const parts = req?.ref_tag.split('|');
      if (`${parts[1]}${parts[2]}` !== existingTag?.part?.part_no) {
        this?.commonHelper?.httpExceptionError(
          `Tag part number ${existingTag?.part?.part_no} does not match with EDI tag part number ${parts[1]}${parts[2]}`,
        );
      }

      const dto = await ValidationTagDto?.format(req);
      const updatedTag = await this.tagModel
        .findByIdAndUpdate(existingTag?.tag_id, dto, { new: true })
        .lean()
        .exec();
      const result = [updatedTag].map(this.tagHelper.map.resValidation);

      return {
        status: 'success',
        message: 'Tag validated successfully.',
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
