import { AccountDocument } from 'src/modules/accounts/account.entity';
import { JWTUtils } from 'src/utils';

export class ClassAuthHelper {
  async generateToken(data: AccountDocument): Promise<string | null> {
    const token = await JWTUtils?.generate({
      account_id: data?._id,
      employee_number: data?.employee_number,
      username: data?.username,
      role: data?.role,
    });
    return token ?? null;
  }
}

export const AuthHelper = {
  class: new ClassAuthHelper(),
};
