import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { CommonHelper, PartHelper } from 'src/helpers';
import { TRESPart, TRESPartChangeHistory } from 'src/types';
import { ResponseFormat } from 'src/types/common';
import { FileUitils, isValidBase64, ValidatorUtils } from 'src/utils';
import { CreatePartDto, UpdatePartDto } from './part.dto';
import { Part, PartDocument } from './part.entity';

@Injectable()
export class PartService {
  commonHelper = CommonHelper;
  partHelper = PartHelper;

  constructor(
    @InjectModel(Part.name) private partModel: Model<PartDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async handleUploadIfValid(
    base64: string | undefined,
    category: string,
    init: string = '',
  ) {
    if (!base64) return init;
    const res = (await isValidBase64(base64 ?? ''))
      ? await FileUitils.upload(base64, category)
      : init;
    return res;
  }

  async create(
    req: CreatePartDto,
  ): Promise<ResponseFormat<PartDocument | TRESPart>> {
    try {
      await ValidatorUtils.validate(CreatePartDto, req);

      const existingPart = await this.partModel
        .findOne({ part_no: req.part_no, is_log: { $ne: true } })
        .select('-is_log')
        .exec();
      if (existingPart) {
        throw new HttpException(
          {
            status: 'error',
            message: `Part No "${existingPart?.part_no}" is already in use. Please choose a different one.`,
            data: [existingPart],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const dto = await CreatePartDto.format(req);
      const part = new this.partModel(dto);
      const savedPart = await part.save();
      const result = [savedPart?.toObject()].map(this.partHelper.map.res);

      if (
        isValidBase64(req?.picture_std ?? '') ||
        isValidBase64(req?.packing ?? '') ||
        isValidBase64(req?.q_point ?? '') ||
        (req?.more_pictures?.some((pic) => isValidBase64(pic)) ?? false)
      ) {
        const picture_std = await this.handleUploadIfValid(
          req?.picture_std,
          'picture_std',
        );
        const packing = await this.handleUploadIfValid(req?.packing, 'packing');
        const q_point = await this.handleUploadIfValid(req?.q_point, 'q_point');
        const more_pictures = await Promise.all(
          req?.more_pictures?.map((pic) =>
            this.handleUploadIfValid(pic, 'more_pictures'),
          ) ?? [],
        );

        const updatedPart = await this.partModel
          .findByIdAndUpdate(
            savedPart?._id,
            { picture_std, packing, q_point, more_pictures },
            { new: true },
          )
          .lean()
          .exec();

        const result = [updatedPart].map(this.partHelper.map.res);

        await this.cacheManager.del('parts');
        await this.cacheManager.del(`part_by_part_id_${result[0]?.part_id}`);

        return {
          status: 'success',
          message: 'Part created successfully.',
          data: result,
        };
      }

      await this.cacheManager.del('parts');
      await this.cacheManager.del(`part_by_part_id_${result[0]?.part_id}`);

      return {
        status: 'success',
        message: 'Part created successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async findAll(): Promise<ResponseFormat<TRESPart>> {
    try {
      const cachedParts = await this.cacheManager.get<TRESPart[]>('parts');
      if (cachedParts) {
        return {
          status: 'success',
          message: 'Parts retrieved from cache.',
          data: cachedParts,
        };
      }

      const parts = await this.partModel
        .find({ is_log: { $ne: true } })
        .select('-is_log')
        .sort({ created_at: -1 })
        .lean()
        .exec();
      await this?.partHelper?.class?.isNoPartFound(!parts);

      const result = parts.map(this.partHelper.map.res);
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

  async findOne(part_id: string): Promise<ResponseFormat<TRESPart>> {
    try {
      const CACHE_KEY = `part_by_part_id_${part_id}`;

      const cachedAccount = await this.cacheManager.get<TRESPart[]>(CACHE_KEY);
      if (cachedAccount) {
        return {
          status: 'success',
          message: 'Account retrieved from cache.',
          data: cachedAccount,
        };
      }

      const part = await this.partModel
        .findOne({ _id: part_id, is_log: { $ne: true } })
        .select('-is_log')
        .sort({ created_at: -1 })
        .exec();
      await this?.partHelper?.class?.isNoPartFound(!part);

      const result = [part].map(this.partHelper.map.res);
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

  async findHistoryOfChanges(
    part_id: string,
  ): Promise<ResponseFormat<TRESPartChangeHistory>> {
    try {
      const CACHE_KEY = `history_of_changes_by_part_id_${part_id}`;

      const cachedHistoryOfChanges =
        await this.cacheManager.get<TRESPartChangeHistory[]>(CACHE_KEY);
      if (cachedHistoryOfChanges) {
        return {
          status: 'success',
          message: 'History of changes to parts retrieved from cache',
          data: cachedHistoryOfChanges,
        };
      }

      const part = await this.partModel
        .findOne({ _id: part_id, is_log: { $ne: true } })
        .exec();
      await this?.partHelper?.class?.isNoPartFound(!part);

      const historyOfChanges = await this.partModel
        .find({ part_no: part.part_no })
        .sort({ created_at: -1 })
        .exec();

      const result = historyOfChanges.map(this.partHelper.map.resChangeHistory);
      await this.cacheManager.set(CACHE_KEY, result);

      return {
        status: 'success',
        message: 'History of changes to parts retrieved successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async update(
    part_id: string,
    req: UpdatePartDto,
  ): Promise<ResponseFormat<PartDocument | TRESPart>> {
    try {
      await ValidatorUtils.validate(UpdatePartDto, req);

      const existingPart = await this.partModel
        .findById(part_id)
        .select('-created_at -created_by -is_deleted -deleted_at -deleted_by ')
        .exec();
      if (existingPart?.is_log) {
        throw new HttpException(
          {
            status: 'error',
            message: `Cannot update the part because it is logged.`,
            data: [existingPart].map(this.partHelper.map.res),
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const picture_std =
        (req?.picture_std ?? '') === ''
          ? null
          : await this.handleUploadIfValid(
              req?.picture_std,
              'picture_std',
              existingPart?.picture_std,
            );
      const q_point =
        (req?.q_point ?? '') === ''
          ? null
          : await this.handleUploadIfValid(
              req?.q_point,
              'q_point',
              existingPart?.q_point,
            );
      const packing =
        (req?.packing ?? '') === ''
          ? null
          : await this.handleUploadIfValid(
              req?.packing,
              'packing',
              existingPart?.packing,
            );
      const lengthBaseFileImages = process.env.BASE_FILE_IMAGES?.length;
      const existingMorePictures = req?.more_pictures
        ?.filter(
          (pic) =>
            pic.slice(0, lengthBaseFileImages) === process.env.BASE_FILE_IMAGES,
        )
        ?.map((pic) => pic.slice(lengthBaseFileImages + 22));
      const morePicturesBase64 = req?.more_pictures?.filter((pic) =>
        isValidBase64(pic),
      );
      const more_pictures = existingMorePictures?.concat(
        await Promise.all(
          morePicturesBase64?.map((pic) =>
            this.handleUploadIfValid(pic, 'more_pictures'),
          ) ?? [],
        ),
      );

      await this?.partHelper?.class?.isNoPartFound(!existingPart);
      const isSame = Object.keys(existingPart.toObject()).every((key) => {
        return key === 'part_no' || key === 'is_log' || key === '_id'
          ? true
          : key === 'picture_std' || key === 'q_point' || key === 'packing'
            ? existingPart[key] === req[key] ||
              req[key] ===
                `${process.env.BASE_FILE_IMAGES}/images/${key}/${existingPart[key]}`
            : key === 'more_pictures'
              ? ((existingPart?.more_pictures ?? [])?.filter((pic, i) => {
                  return (
                    req?.more_pictures[i] ===
                    `${process.env.BASE_FILE_IMAGES}/images/${key}/${pic}`
                  );
                })?.length ?? 0) === (existingPart?.more_pictures?.length ?? 0)
              : existingPart[key] === req[key];
      });

      if (isSame) {
        return {
          status: 'success',
          message:
            'Unable to update information because the information has not changed.',
          data: [existingPart].map(this.partHelper.map.res),
        };
      }

      await this.partModel
        .findByIdAndUpdate(part_id, { is_log: true }, { new: true })
        .lean()
        .exec();

      const dto = await CreatePartDto.format({
        ...req,
        picture_std,
        q_point,
        packing,
        more_pictures,
        part_no: existingPart.part_no,
      });
      const createPart = new this.partModel(dto);
      const savedPart = await createPart.save();
      const result = [savedPart?.toObject()].map(this.partHelper.map.res);

      await this.cacheManager.del('parts');
      await this.cacheManager.del(`part_by_part_id_${part_id}`);

      return {
        status: 'success',
        message: 'Part updated successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async delete(
    deleted_by: string,
    part_id: string,
  ): Promise<ResponseFormat<PartDocument | TRESPart>> {
    try {
      const existingPart = await this.partModel.findById(part_id).exec();
      await this?.partHelper?.class?.isNoPartFound(!existingPart);
      if (existingPart?.is_log) {
        throw new HttpException(
          {
            status: 'error',
            message: `Cannot delete the part because it is logged.`,
            data: [existingPart].map(this.partHelper.map.res),
          },
          HttpStatus.FORBIDDEN,
        );
      }

      if (existingPart.is_deleted) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Part is already deleted.',
            data: [existingPart].map(this.partHelper.map.res),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedAccount = await this.partModel
        .findByIdAndUpdate(
          part_id,
          {
            is_deleted: true,
            deleted_by,
            deleted_at: new Date(),
            updated_at: new Date(),
          },
          { new: true },
        )
        .lean()
        .exec();

      const result = [updatedAccount].map(this.partHelper.map.res);

      await this.cacheManager.del('parts');
      await this.cacheManager.del(`part_by_part_id_${part_id}`);

      return {
        status: 'success',
        message: 'Part deleted successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }
}
