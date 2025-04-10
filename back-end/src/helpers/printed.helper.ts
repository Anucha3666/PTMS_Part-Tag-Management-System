import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { AccountDocument } from 'src/modules/account/account.entity';
import { TRole } from 'src/types';

export class ClassPrintedHelper {
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

  async isNoPrintedFound(isNoPrintedFound: boolean) {
    if (isNoPrintedFound) {
      throw new HttpException(
        {
          status: 'error',
          message: `No printed found with this id.`,
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

const mapRES = (part: any) => ({
  printed_id: part._id.toString() ?? '',
  tags: part?.tags ?? [],
  summary: part.summary ?? [],
  printed_at: part.printed_at,
  printed_by: part.printed_by,
});

export const PrintedHelper = {
  class: new ClassPrintedHelper(),
  map: { res: mapRES },
};
