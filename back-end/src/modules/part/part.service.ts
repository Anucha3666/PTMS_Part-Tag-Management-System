import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { CommonHelper, PartHelper } from 'src/helpers';
import { TRESPart } from 'src/types';
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

  async handleUploadIfValid(base64: string | undefined, category: string) {
    return isValidBase64(base64 ?? '')
      ? await FileUitils.upload(base64, category)
      : '';
  }

  async create(req: CreatePartDto): Promise<ResponseFormat<PartDocument>> {
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
        .lean()
        .exec();
      await this?.partHelper?.class?.isNoAccountFound(!parts);

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
        .exec();
      await this?.partHelper?.class?.isNoAccountFound(!part);

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
  ): Promise<ResponseFormat<TRESPart>> {
    try {
      const CACHE_KEY = `history_of_changes_by_part_id_${part_id}`;

      const cachedHistoryOfChanges =
        await this.cacheManager.get<TRESPart[]>(CACHE_KEY);
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
      await this?.partHelper?.class?.isNoAccountFound(!part);

      const historyOfChanges = await this.partModel
        .find({ part_no: part.part_no })
        .exec();

      const result = historyOfChanges.map(this.partHelper.map.res);
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

      const part = await this.partModel
        .findById(part_id)
        .select(
          '-part_no -_id -is_log -created_at -created_by -is_deleted -deleted_at -deleted_by ',
        )
        .exec();
      await this?.partHelper?.class?.isNoAccountFound(!part);
      const isSame = Object.keys(part.toObject()).every((key) => {
        return part[key] === req[key];
      });
      if (isSame) {
        return {
          status: 'success',
          message:
            'Unable to update information because the information has not changed.',
          data: [part],
        };
      }

      await this.partModel
        .findByIdAndUpdate(part_id, { is_log: true }, { new: true })
        .lean()
        .exec();

      const dto = await CreatePartDto.format({ ...req, part_no: part.part_no });
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
  ): Promise<ResponseFormat<PartDocument>> {
    try {
      const existingPart = await this.partModel.findById(part_id).exec();
      await this?.partHelper?.class?.isNoAccountFound(!existingPart);

      if (existingPart.is_deleted) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Part is already deleted.',
            data: [],
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
