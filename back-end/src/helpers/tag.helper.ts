import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { TagDocument } from 'src/modules/tag/tag.entity';
import { TRESTag } from 'src/types';

export class ClassTagHelper {
  async findTagByTagNo(
    tagModel: Model<TagDocument>,
    tag_no: string,
  ): Promise<TagDocument | null> {
    return tagModel.findOne({ tag_no }).exec();
  }

  async findTagByTagID(
    tagModel: Model<TagDocument>,
    _id: string,
  ): Promise<TagDocument | null> {
    return tagModel
      .findOne({
        _id,
      })
      .exec();
  }

  async findTagAndJoinPartByTagID(
    tagModel: Model<TagDocument>,
    tag_no: string,
  ): Promise<TRESTag | null> {
    const tag = tagModel
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
          $unwind: {
            path: '$part_info',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .exec();

    const result = [tag].map(mapRES);

    return result[0];
  }

  async isNoTagFound(isNoTagFound: boolean) {
    if (isNoTagFound) {
      throw new HttpException(
        {
          status: 'error',
          message: `No tag found with this id.`,
          data: [],
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

const mapRES = (data: any) => ({
  tag_id: data._id.toString() ?? '',
  printed_id: data.printed_id,
  printed_by: data.printed_by,
  printed_at: data.printed_at,
  tag_no: data.tag_no,
  ref_tag: data.ref_tag,
  checked_by: data.checked_by,
  checked_at: data.checked_at,
  part_id: data.part_id,
  part_no: data?.part_info?.part_no,
  part_name: data?.part_info?.part_name,
  packing_std: data?.part_info?.packing_std,
  picture_std: data?.part_info?.picture_std
    ? `${process.env.BASE_FILE_IMAGES}/images/picture_std/${data?.part_info?.picture_std}`
    : null,
  q_point: data?.part_info?.q_point
    ? `${process.env.BASE_FILE_IMAGES}/images/q_point/${data?.part_info?.q_point}`
    : null,
  packing: data?.part_info?.packing
    ? `${process.env.BASE_FILE_IMAGES}/images/packing/${data?.part_info?.packing}`
    : null,
  more_pictures:
    data?.part_info?.more_pictures?.length > 0
      ? data?.part_info?.more_pictures?.map(
          (more_pictures) =>
            `${process.env.BASE_FILE_IMAGES}/images/more_pictures/${more_pictures}`,
        )
      : [],
  is_log: data?.part_info?.is_log,
  created_by: data?.part_info?.created_by,
  created_at: data?.part_info?.created_at,
  is_deleted: data?.part_info?.is_deleted,
  deleted_at: data?.part_info?.deleted_at,
  deleted_by: data?.part_info?.deleted_by,
});

const mapRESValidation = (data: any) => ({
  tag_id: data._id.toString() ?? '',
  printed_id: data.printed_id,
  part_id: data.part_id,
  tag_no: data.tag_no,
  ref_tag: data.ref_tag,
  checked_by: data.checked_by,
  checked_at: data.checked_at,
});

export const TagHelper = {
  class: new ClassTagHelper(),
  map: { res: mapRES, resValidation: mapRESValidation },
};
