import { HttpException, HttpStatus } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { PartDocument } from 'src/modules/part/part.entity';

export class ClassPartHelper {
  async findParts(
    partModel: Model<PartDocument>,
  ): Promise<PartDocument[] | null> {
    return partModel?.aggregate([
      {
        $match: {
          is_log: { $ne: true },
        },
      },
      {
        $sort: { created_at: -1 },
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
      {
        $project: {
          is_log: 0,
        },
      },
    ]);
  }

  async findPartByPartNo(
    partModel: Model<PartDocument>,
    part_no: string,
  ): Promise<PartDocument | null> {
    return partModel.findOne({ part_no }).exec();
  }

  async findPartByPartID(
    partModel: Model<PartDocument>,
    _id: string,
  ): Promise<PartDocument | null> {
    return partModel.findOne({ _id }).exec();
  }

  async findleanPartByPartID(
    partModel: Model<PartDocument>,
    partIds: string[],
  ): Promise<PartDocument[] | null> {
    return partModel.aggregate([
      {
        $match: {
          _id: { $in: partIds.map((id) => new mongoose.Types.ObjectId(id)) },
          is_log: { $ne: true },
        },
      },
      {
        $sort: { created_at: -1 },
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
      {
        $project: {
          is_log: 0,
        },
      },
    ]);
  }

  async isNoPartFound(isNoPartFound: boolean) {
    if (isNoPartFound) {
      throw new HttpException(
        {
          status: 'error',
          message: `No part found with this id.`,
          data: [],
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

const mapRES = (part: any) => ({
  part_id: part._id.toString() ?? '',
  customer:
    (part?.customer?._id.toString() ?? '') === ''
      ? null
      : {
          customer_id: part?.customer?._id.toString() ?? '',
          customer_name: part?.customer?.customer_name,
          customer_description: part?.customer?.customer_description,
          logo: part.customer?.logo
            ? `${process.env.BASE_FILE_IMAGES}/customer_logo/${part.customer?.logo}`
            : null,
        },
  part_no: part.part_no,
  part_name: part.part_name,
  packing_std: part.packing_std,
  customer_name: part.customer_name,
  picture_std: part.picture_std
    ? `${process.env.BASE_FILE_IMAGES}/picture_std/${part.picture_std}`
    : null,
  q_point: part.q_point
    ? `${process.env.BASE_FILE_IMAGES}/q_point/${part.q_point}`
    : null,
  packing: part.packing
    ? `${process.env.BASE_FILE_IMAGES}/packing/${part.packing}`
    : null,
  more_pictures:
    part?.more_pictures?.length > 0
      ? part?.more_pictures?.map(
          (more_pictures) =>
            `${process.env.BASE_FILE_IMAGES}/more_pictures/${more_pictures}`,
        )
      : [],
  created_at: part.created_at,
  created_by: part.created_by,
  is_deleted: part.is_deleted,
  deleted_at: part.deleted_at,
  deleted_by: part.deleted_by,
});

const mapRESChangeHistory = (part: any) => ({
  part_id: part._id.toString() ?? '',
  part_no: part.part_no,
  part_name: part.part_name,
  packing_std: part.packing_std,
  customer_name: part.customer_name,
  picture_std: part.picture_std
    ? `${process.env.BASE_FILE_IMAGES}/picture_std/${part.picture_std}`
    : null,
  q_point: part.q_point
    ? `${process.env.BASE_FILE_IMAGES}/q_point/${part.q_point}`
    : null,
  packing: part.packing
    ? `${process.env.BASE_FILE_IMAGES}/packing/${part.packing}`
    : null,
  more_pictures:
    part.more_pictures?.length > 0
      ? part.more_pictures?.map(
          (more_pictures) =>
            `${process.env.BASE_FILE_IMAGES}/more_pictures/${more_pictures}`,
        )
      : [],

  is_log: part.is_log,
  created_at: part.created_at,
  created_by: part.created_by,
  is_deleted: part.is_deleted,
  deleted_at: part.deleted_at,
  deleted_by: part.deleted_by,
});

export const PartHelper = {
  class: new ClassPartHelper(),
  map: { res: mapRES, resChangeHistory: mapRESChangeHistory },
};
