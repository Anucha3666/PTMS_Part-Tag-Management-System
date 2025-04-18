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

  async findTagAndJoinPartAndPrintedAndAccountByTagNo(
    tagModel: Model<TagDocument>,
    tag_no: string,
  ): Promise<TRESTag | null> {
    const tag = await tagModel
      .aggregate([
        {
          $match: {
            tag_no,
            printed_id: { $exists: true, $ne: null },
            part_id: { $exists: true, $ne: null },
          },
        },
        {
          $addFields: {
            printed_id: { $toObjectId: '$printed_id' },
            part_id: { $toObjectId: '$part_id' },
            checked_by: { $toObjectId: '$checked_by' },
          },
        },
        {
          $lookup: {
            from: 'printeds',
            localField: 'printed_id',
            foreignField: '_id',
            as: 'printed_info',
          },
        },
        {
          $unwind: { path: '$printed_info', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'parts',
            localField: 'part_id',
            foreignField: '_id',
            as: 'part_info',
          },
        },
        { $unwind: { path: '$part_info', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            printed_by_object_id: { $toObjectId: '$printed_info.printed_by' },
          },
        },
        {
          $lookup: {
            from: 'accounts',
            localField: 'printed_by_object_id',
            foreignField: '_id',
            as: 'printed_by_info',
          },
        },
        {
          $unwind: {
            path: '$printed_by_info',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'accounts',
            localField: 'checked_by',
            foreignField: '_id',
            as: 'checked_by_info',
          },
        },
        {
          $unwind: {
            path: '$checked_by_info',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .exec();

    const result = tag.map(mapRESOne);
    return result[0] || null;
  }

  async findTagAndJoinPartAndPrintedByTagNo(
    tagModel: Model<TagDocument>,
    tag_no: string,
  ): Promise<TRESTag | null> {
    const tag = await tagModel
      .aggregate([
        {
          $match: {
            tag_no: tag_no,
            printed_id: { $exists: true, $ne: null },
            part_id: { $exists: true, $ne: null },
          },
        },
        {
          $addFields: {
            printed_id: { $toObjectId: '$printed_id' },
            part_id: { $toObjectId: '$part_id' },
          },
        },
        {
          $lookup: {
            from: 'printeds',
            localField: 'printed_id',
            foreignField: '_id',
            as: 'printed_info',
          },
        },
        {
          $unwind: {
            path: '$printed_info',
            preserveNullAndEmptyArrays: true,
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

    const result = tag.map(mapRES);
    return result[0] || null;
  }

  async findTagsAndJoinPartAndPrinted(
    tagModel: Model<TagDocument>,
  ): Promise<TRESTag[] | null> {
    const tags = await tagModel
      .aggregate([
        {
          $sort: { tag_no: -1 },
        },
        {
          $addFields: {
            printed_id: { $toObjectId: '$printed_id' },
            part_id: { $toObjectId: '$part_id' },
          },
        },
        {
          $lookup: {
            from: 'printeds',
            localField: 'printed_id',
            foreignField: '_id',
            as: 'printed_info',
          },
        },
        {
          $unwind: {
            path: '$printed_info',
            preserveNullAndEmptyArrays: true,
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

    const result = tags.map(mapRES);
    return result || null;
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
  printed_by: data?.printed_info?.printed_by,
  printed_at: data?.printed_info?.printed_at,
  tag_no: data.tag_no,
  ref_tag: data.ref_tag,
  checked_by: data.checked_by,
  checked_at: data.checked_at,
  part: {
    part_id: data?.part_id,
    part_no: data?.part_info?.part_no,
    part_name: data?.part_info?.part_name,
    packing_std: data?.part_info?.packing_std,
    customer_name: data?.part_info?.customer_name,
    picture_std: data?.part_info?.picture_std
      ? `${process.env.BASE_FILE_IMAGES}/picture_std/${data?.part_info?.picture_std}`
      : null,
    q_point: data?.part_info?.q_point
      ? `${process.env.BASE_FILE_IMAGES}/q_point/${data?.part_info?.q_point}`
      : null,
    packing: data?.part_info?.packing
      ? `${process.env.BASE_FILE_IMAGES}/packing/${data?.part_info?.packing}`
      : null,
    more_pictures:
      data?.part_info?.more_pictures?.length > 0
        ? data?.part_info?.more_pictures?.map(
            (more_pictures) =>
              `${process.env.BASE_FILE_IMAGES}/more_pictures/${more_pictures}`,
          )
        : [],
    is_log: data?.part_info?.is_log,
    created_by: data?.part_info?.created_by,
    created_at: data?.part_info?.created_at,
    is_deleted: data?.part_info?.is_deleted,
    deleted_at: data?.part_info?.deleted_at,
    deleted_by: data?.part_info?.deleted_by,
  },
});

const mapRESOne = (data: any) => ({
  tag_id: data._id.toString() ?? '',
  printed_id: data.printed_id,
  printed_by: {
    employee_number: data?.printed_by_info?.employee_number,
    first_name: data?.printed_by_info?.first_name,
    last_name: data?.printed_by_info?.last_name,
    profile_picture: data?.printed_by_info?.profile_picture
      ? `${process.env.BASE_FILE_IMAGES}/profile/${data?.printed_by_info?.profile_picture}`
      : null,
  },
  printed_at: data?.printed_info?.printed_at,
  tag_no: data.tag_no,
  ref_tag: data.ref_tag,
  checked_by: {
    employee_number: data?.checked_by_info?.employee_number,
    first_name: data?.checked_by_info?.first_name,
    last_name: data?.checked_by_info?.last_name,
    profile_picture: data?.checked_by_info?.profile_picture
      ? `${process.env.BASE_FILE_IMAGES}/profile_picture/${data?.checked_by_info?.profile_picture}`
      : null,
  },
  checked_at: data.checked_at,
  part: {
    part_id: data?.part_id,
    part_no: data?.part_info?.part_no,
    part_name: data?.part_info?.part_name,
    packing_std: data?.part_info?.packing_std,
    customer_name: data?.part_info?.customer_name,
    picture_std: data?.part_info?.picture_std
      ? `${process.env.BASE_FILE_IMAGES}/picture_std/${data?.part_info?.picture_std}`
      : null,
    q_point: data?.part_info?.q_point
      ? `${process.env.BASE_FILE_IMAGES}/q_point/${data?.part_info?.q_point}`
      : null,
    packing: data?.part_info?.packing
      ? `${process.env.BASE_FILE_IMAGES}/packing/${data?.part_info?.packing}`
      : null,
    more_pictures:
      data?.part_info?.more_pictures?.length > 0
        ? data?.part_info?.more_pictures?.map(
            (more_pictures) =>
              `${process.env.BASE_FILE_IMAGES}/more_pictures/${more_pictures}`,
          )
        : [],
    is_log: data?.part_info?.is_log,
    created_by: data?.part_info?.created_by,
    created_at: data?.part_info?.created_at,
    is_deleted: data?.part_info?.is_deleted,
    deleted_at: data?.part_info?.deleted_at,
    deleted_by: data?.part_info?.deleted_by,
  },
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
  map: { res: mapRES, resOne: mapRESOne, resValidation: mapRESValidation },
};
