import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { CommonHelper, PartHelper } from 'src/helpers';
import { MicroServiceUplode } from 'src/services';
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
    private readonly microServiceUplode: MicroServiceUplode,
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
      const existingCustomer = await this.partModel
        .findById(req?.customer_id)
        .exec();
      if (existingCustomer) {
        throw new HttpException(
          {
            status: 'error',
            message: `Customer is already in use. Please choose a different one.`,
            data: [existingPart],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const pictureSTD = req?.picture_std;
      const packing = req?.packing;
      const qPoint = req?.q_point;
      const morePictures = req?.more_pictures;
      if (
        pictureSTD &&
        pictureSTD instanceof Object &&
        'buffer' in pictureSTD
      ) {
        const res = await await this.microServiceUplode.uploadFile(
          'ptms/images/picture_std',
          pictureSTD,
        );
        req = { ...req, picture_std: res?.name ?? null };
      }
      if (packing && packing instanceof Object && 'buffer' in packing) {
        const res = await await this.microServiceUplode.uploadFile(
          'ptms/images/packing',
          packing,
        );
        req = { ...req, packing: res?.name ?? null };
      }
      if (qPoint && qPoint instanceof Object && 'buffer' in qPoint) {
        const res = await await this.microServiceUplode.uploadFile(
          'ptms/images/q_point',
          qPoint,
        );
        req = { ...req, q_point: res?.name ?? null };
      }
      if (Array.isArray(morePictures)) {
        const updatedMorePictures = [];
        for (const pic of morePictures) {
          if (typeof pic === 'string') {
            updatedMorePictures.push(pic);
          } else if (pic instanceof Object && 'buffer' in pic) {
            const res = await this.microServiceUplode.uploadFile(
              'ptms/images/more_pictures',
              pic,
            );
            updatedMorePictures.push(res?.name ?? null);
          }
        }
        req = {
          ...req,
          more_pictures: updatedMorePictures?.filter(
            (item) => (item ?? '') !== '',
          ),
        };
      }

      await ValidatorUtils.validate(CreatePartDto, req);

      const dto = await CreatePartDto.format(req);
      const part = new this.partModel(dto);
      const savedPart = await part.save();
      const result = [savedPart?.toObject()].map(this.partHelper.map.res);

      await this.cacheManager.del('parts');

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

      const parts = await this?.partHelper?.class?.findParts(this?.partModel);
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
      const part = await this.partModel
        .findOne({ _id: part_id, is_log: { $ne: true } })
        .select('-is_log')
        .sort({ created_at: -1 })
        .exec();
      await this?.partHelper?.class?.isNoPartFound(!part);

      const result = [part].map(this.partHelper.map.res);

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
        .aggregate([
          {
            $match: {
              part_no: part.part_no,
            },
          },
          {
            $sort: {
              created_at: -1,
            },
          },
          {
            $addFields: {
              customerObjectId: {
                $convert: {
                  input: '$customer_id',
                  to: 'objectId',
                  onError: null,
                  onNull: null,
                },
              },
            },
          },
          {
            $lookup: {
              from: 'customers',
              localField: 'customerObjectId',
              foreignField: '_id',
              as: 'customer',
            },
          },
          {
            $unwind: {
              path: '$customer',
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
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

      await this?.partHelper?.class?.isNoPartFound(!existingPart);

      const pictureSTD = req?.picture_std;
      const packing = req?.packing;
      const qPoint = req?.q_point;
      const morePictures = req?.more_pictures;
      if (
        pictureSTD &&
        pictureSTD instanceof Object &&
        'buffer' in pictureSTD
      ) {
        const res = await await this.microServiceUplode.uploadFile(
          'ptms/images/picture_std',
          pictureSTD,
        );
        req = { ...req, picture_std: res?.name ?? null };
      }
      if (packing && packing instanceof Object && 'buffer' in packing) {
        const res = await await this.microServiceUplode.uploadFile(
          'ptms/images/packing',
          packing,
        );
        req = { ...req, packing: res?.name ?? null };
      }
      if (qPoint && qPoint instanceof Object && 'buffer' in qPoint) {
        const res = await await this.microServiceUplode.uploadFile(
          'ptms/images/q_point',
          qPoint,
        );
        req = { ...req, q_point: res?.name ?? null };
      }
      if (Array.isArray(morePictures)) {
        const updatedMorePictures = [];
        for (const pic of morePictures) {
          if (typeof pic === 'string') {
            updatedMorePictures.push(pic);
          } else if (pic instanceof Object && 'buffer' in pic) {
            const res = await this.microServiceUplode.uploadFile(
              'ptms/images/more_pictures',
              pic,
            );
            updatedMorePictures.push(res?.name ?? null);
          }
        }

        req = {
          ...req,
          more_pictures: updatedMorePictures?.filter(
            (item) => (item ?? '') !== '',
          ),
        };
      }

      await ValidatorUtils.validate(UpdatePartDto, req);

      if (
        String(req?.picture_std)?.includes(`${process.env.BASE_FILE_IMAGES}`)
      ) {
        req = {
          ...req,
          picture_std: existingPart?.picture_std,
        };
      }
      if (String(req?.packing)?.includes(`${process.env.BASE_FILE_IMAGES}`)) {
        req = {
          ...req,
          packing: existingPart?.packing,
        };
      }
      if (String(req?.q_point)?.includes(`${process.env.BASE_FILE_IMAGES}`)) {
        req = {
          ...req,
          q_point: existingPart?.q_point,
        };
      }
      if (Array.isArray(req?.more_pictures)) {
        const updatedMorePictures = req.more_pictures.map((pic) => {
          if (String(pic).includes(`${process.env.BASE_FILE_IMAGES}`)) {
            return (
              existingPart?.more_pictures?.find((p) =>
                String(pic).includes(p),
              ) ?? pic
            );
          }
          return pic;
        });
        req = { ...req, more_pictures: updatedMorePictures };
      }
      const isSame = Object.keys(existingPart.toObject()).every((key) => {
        return key === 'part_no' || key === 'is_log' || key === '_id'
          ? true
          : key === 'more_pictures'
            ? JSON.stringify(req?.more_pictures) ===
              JSON.stringify(existingPart?.more_pictures)
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
        part_no: existingPart.part_no,
      });
      const createPart = new this.partModel(dto);
      const savedPart = await createPart.save();
      const result = [savedPart?.toObject()].map(this.partHelper.map.res);

      await this.cacheManager.del('parts');

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
