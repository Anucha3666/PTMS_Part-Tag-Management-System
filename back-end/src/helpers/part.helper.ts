import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { PartDocument } from 'src/modules/part/part.entity';

export class ClassPartHelper {
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
    return partModel
      .find({
        _id: { $in: partIds },
      })
      .select('_id')
      .lean();
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
  part_no: part.part_no,
  part_name: part.part_name,
  packing_std: part.packing_std,
  picture_std: part.picture_std
    ? `${process.env.BASE_FILE_IMAGES}/images/picture_std/${part.picture_std}`
    : null,
  q_point: part.q_point
    ? `${process.env.BASE_FILE_IMAGES}/images/q_point/${part.q_point}`
    : null,
  packing: part.packing
    ? `${process.env.BASE_FILE_IMAGES}/images/packing/${part.packing}`
    : null,
  more_pictures:
    part?.more_pictures?.length > 0
      ? part?.more_pictures?.map(
          (more_pictures) =>
            `${process.env.BASE_FILE_IMAGES}/images/more_pictures/${more_pictures}`,
        )
      : [],
  created_by: part.created_by,
  created_at: part.created_at,
  is_deleted: part.is_deleted,
  deleted_at: part.deleted_at,
  deleted_by: part.deleted_by,
});

const mapRESChangeHistory = (part: any) => ({
  part_id: part._id.toString() ?? '',
  part_no: part.part_no,
  part_name: part.part_name,
  packing_std: part.packing_std,
  picture_std: part.picture_std
    ? `${process.env.BASE_FILE_IMAGES}/images/picture_std/${part.picture_std}`
    : null,
  q_point: part.q_point
    ? `${process.env.BASE_FILE_IMAGES}/images/q_point/${part.q_point}`
    : null,
  packing: part.packing
    ? `${process.env.BASE_FILE_IMAGES}/images/packing/${part.packing}`
    : null,
  more_pictures:
    part.more_pictures?.length > 0
      ? part.more_pictures?.map(
          (more_pictures) =>
            `${process.env.BASE_FILE_IMAGES}/images/more_pictures/${more_pictures}`,
        )
      : [],

  is_log: part.is_log,
  created_by: part.created_by,
  created_at: part.created_at,
  is_deleted: part.is_deleted,
  deleted_at: part.deleted_at,
  deleted_by: part.deleted_by,
});

export const PartHelper = {
  class: new ClassPartHelper(),
  map: { res: mapRES, resChangeHistory: mapRESChangeHistory },
};
