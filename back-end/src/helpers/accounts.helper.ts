import { Model } from 'mongoose';
import { AccountDocument } from 'src/modules/accounts/account.entity';
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
}

export const mapAccountToTRESAccount = (account: any) => ({
  account_id: account._id.toString(),
  ...account,
  profile_picture: account.profile_picture ?? null,
  role: account.role ?? null,
  created_at: account.created_at ?? null,
  updated_at: account.updated_at ?? null,
  _id: undefined,
});

export const AccountHelper = {
  class: new ClassAccountHelper(),
  map: mapAccountToTRESAccount,
};
