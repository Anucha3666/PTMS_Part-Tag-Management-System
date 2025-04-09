import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { AccountDocument } from 'src/modules/account/account.entity';
import { TRole } from 'src/types';

export class ClassAccountHelper {
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

  async isNoAccountFound(isNoAccountFound: boolean) {
    if (isNoAccountFound) {
      throw new HttpException(
        {
          status: 'error',
          message: `No account found with this id.`,
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

export const mapAccountToTRESSignIn = (account: any) => ({
  account_id: account._id.toString(),
  employee_number: account.employee_number,
  first_name: account.first_name,
  last_name: account.last_name,
  username: account.username,
  profile_picture: account.profile_picture
    ? `${process.env.BASE_FILE_IMAGES}/images/profile/${account.profile_picture}`
    : null,
  role: account.role ?? null,
  created_at: account.created_at ?? null,
  updated_at: account.updated_at ?? null,
  token: '',
  _id: undefined,
});

export const mapAccountToTRESAccount = (account: any) => ({
  account_id: account._id.toString(),
  employee_number: account.employee_number,
  first_name: account.first_name,
  last_name: account.last_name,
  username: account.username,
  is_approved: account.is_approved,
  is_deleted: account.is_deleted,
  role: account.role,
  profile_picture: account.profile_picture
    ? `${process.env.BASE_FILE_IMAGES}/profile/${account.profile_picture}`
    : null,
  created_at: account.created_at,
  updated_at: account.updated_at,
  created_by: account.created_by,
  approved_at: account.approved_at,
  approved_by: account.approved_by,
  deleted_at: account.deleted_at,
  deleted_by: account.deleted_by,
});

export const AccountHelper = {
  class: new ClassAccountHelper(),
  mapSignIn: mapAccountToTRESSignIn,
  map: mapAccountToTRESAccount,
};
