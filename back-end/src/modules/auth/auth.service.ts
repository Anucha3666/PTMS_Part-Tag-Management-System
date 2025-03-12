import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { AccountHelper, AuthHelper } from 'src/helpers';
import { ResponseFormat } from 'src/types/common';
import { BcryptUtils } from 'src/utils';
import { Account, AccountDocument } from '../accounts/account.entity';
import { SignInDto } from './auth.dto';

@Injectable()
export class AuthService {
  authHelper = AuthHelper;
  accountHelper = AccountHelper;

  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signIn(req: SignInDto): Promise<ResponseFormat<AccountDocument>> {
    try {
      const dataUser = await this.accountHelper.class.findAccountByUsername(
        this?.accountModel,
        req?.username,
      );

      const isVedifind = await BcryptUtils?.comparePassword(
        req?.password,
        dataUser?.password,
      );

      if (!isVedifind) {
        throw new HttpException(
          {
            status: 'error',
            message: `Invalid username or password.`,
            data: [],
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.cacheManager.del('accounts');
      const token = await this?.authHelper?.class?.generateToken(dataUser);

      const result = [dataUser?.toObject()]
        .map(this.accountHelper.map)
        ?.map((item) => ({
          ...item,
          token,
        }));

      return {
        status: 'success',
        message: 'Sign in successfully.',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { status: 'error', message: 'Error sign in.', data: [] },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
