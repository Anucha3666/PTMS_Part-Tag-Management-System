import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { AccountDocument } from 'src/modules/account/account.entity';
import { TRole } from 'src/types';

export class ClassTagHelper {
  async findAccountByEmployeeNumber(
    accountModel: Model<AccountDocument>,
    employee_number: string,
  ): Promise<AccountDocument | null> {
    return accountModel.findOne({ employee_number }).exec();
  }

  async findAccountByUsername(
    accountModel: Model<AccountDocument>,
    username: string,
  ): Promise<AccountDocument | null> {
    return accountModel.findOne({ username }).exec();
  }

  async findAccountByEmployeeNumberOrUsername(
    accountModel: Model<AccountDocument>,
    employee_number: string,
    username: string,
  ): Promise<AccountDocument | null> {
    return accountModel
      .findOne({
        $or: [{ employee_number }, { username }],
      })
      .exec();
  }

  async findAccountByRole(
    accountModel: Model<AccountDocument>,
    role: TRole,
  ): Promise<AccountDocument | null> {
    return accountModel
      .findOne({
        role,
      })
      .exec();
  }

  async findAccountByAccountID(
    accountModel: Model<AccountDocument>,
    _id: string,
  ): Promise<AccountDocument | null> {
    return accountModel
      .findOne({
        _id,
      })
      .exec();
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

  async isForgotPassword(isForgotPassword: boolean) {
    if (isForgotPassword) {
      throw new HttpException(
        {
          status: 'error',
          message:
            'This account is currently undergoing password reset review. Please wait for confirmation from the administrator.',
          data: [],
        },
        HttpStatus.FORBIDDEN,
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

export const TagHelper = {
  class: new ClassTagHelper(),
  map: { res: mapRES },
};
