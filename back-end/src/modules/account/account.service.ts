import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { CommonHelper } from 'src/helpers';
import { AccountHelper } from 'src/helpers/accounts.helper';
import { MicroServiceUplode } from 'src/services';
import { TRESAccunt } from 'src/types';
import { ResponseFormat } from 'src/types/common';
import { BcryptUtils, ValidatorUtils } from 'src/utils';
import {
  ChangeRoleDto,
  CreateAccountDto,
  UpdateAccountDto,
} from './account.dto';
import { Account, AccountDocument } from './account.entity';

@Injectable()
export class AccountsService {
  commonHelper = CommonHelper;
  accountHelper = AccountHelper;

  constructor(
    private readonly httpService: HttpService,
    private readonly microServiceUplode: MicroServiceUplode,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(req: CreateAccountDto): Promise<ResponseFormat<TRESAccunt>> {
    try {
      const profilePicture = req?.profile_picture;

      if (
        profilePicture &&
        profilePicture instanceof Object &&
        'buffer' in profilePicture
      ) {
        const res = await await this.microServiceUplode.uploadFile(
          'ptms/images/profile',
          profilePicture,
        );
        req = { ...req, profile_picture: res?.name ?? null };
      }

      await ValidatorUtils.validate(CreateAccountDto, req);

      const existingAccount =
        await this.accountHelper.class.findAccountByEmployeeNumberOrUsername(
          this?.accountModel,
          req?.employee_number,
          req?.username,
        );

      if (existingAccount) {
        let duplicateField = '';

        if (existingAccount.employee_number === req.employee_number) {
          duplicateField = `Employee number "${req.employee_number}"`;
        }
        if (existingAccount.username === req.username) {
          duplicateField += duplicateField
            ? ` and username "${req.username}"`
            : `Username "${req.username}"`;
        }

        throw new HttpException(
          {
            status: 'error',
            message: `${duplicateField} is already in use. Please choose a different one.`,
            data: [existingAccount]?.map(this.accountHelper.map),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const dto = await CreateAccountDto.format(req);
      const account = new this.accountModel({ ...dto });
      const savedAccount = await account.save();
      const result = [savedAccount].map(this.accountHelper.map);

      await this.cacheManager.del('accounts');

      return {
        status: 'success',
        message:
          (req?.profile_picture ?? '' !== '')
            ? 'Account created successfully. But profile picture is not valid.'
            : 'Account created successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async findAll(): Promise<ResponseFormat<TRESAccunt>> {
    try {
      const cachedAccounts =
        await this.cacheManager.get<TRESAccunt[]>('accounts');
      if (cachedAccounts) {
        return {
          status: 'success',
          message: 'Accounts retrieved from cache.',
          data: cachedAccounts,
        };
      }

      const accounts = await this.accountModel
        .find()
        .select('-password')
        .lean()
        .exec();
      if ((accounts?.length ?? 0) <= 0) {
        throw new HttpException(
          {
            status: 'error',
            message: 'No accounts found in the system.',
            data: [],
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const result = accounts.map(this.accountHelper.map);
      await this.cacheManager.set('accounts', result);

      return {
        status: 'success',
        message: 'Accounts retrieved successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async findOne(account_id: string): Promise<ResponseFormat<TRESAccunt>> {
    try {
      const CACHE_KEY = `account_by_account_id_${account_id}`;

      const cachedAccount =
        await this.cacheManager.get<TRESAccunt[]>(CACHE_KEY);
      if (cachedAccount) {
        return {
          status: 'success',
          message: 'Account retrieved from cache.',
          data: cachedAccount,
        };
      }

      const existingAccount = await this.accountModel
        .findById(account_id)
        .select('-password')
        .exec();
      await this?.accountHelper?.class?.isNoAccountFound(!existingAccount);

      const result = [existingAccount].map(this.accountHelper.map);
      await this.cacheManager.set(CACHE_KEY, result);

      return {
        status: 'success',
        message: 'Account retrieved successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async approve(
    approved_by: string,
    account_id: string,
  ): Promise<ResponseFormat<TRESAccunt>> {
    try {
      const existingAccount = await this.accountModel
        .findById(account_id)
        .select(
          '-password -_id -created_at -updated_at -username -role -employee_number',
        )
        .exec();
      await this?.accountHelper?.class?.isNoAccountFound(!existingAccount);

      if (existingAccount.approved_by || existingAccount.approved_at) {
        throw new HttpException(
          {
            status: 'error',
            message: `Account is already ${existingAccount?.is_approved ? 'approved' : 'rejected'}.`,
            data: [],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedAccount = await this.accountModel
        .findByIdAndUpdate(
          account_id,
          {
            is_approved: true,
            approved_by,
            approved_at: new Date(),
            updated_at: new Date(),
          },
          { new: true },
        )
        .select('-password')
        .lean()
        .exec();

      const result = [updatedAccount].map(this.accountHelper.map);

      await this.cacheManager.del('accounts');
      await this.cacheManager.del(`account_by_account_id_${account_id}`);

      return {
        status: 'success',
        message: 'Approved account successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async reject(
    approved_by: string,
    account_id: string,
  ): Promise<ResponseFormat<TRESAccunt>> {
    try {
      const existingAccount = await this.accountModel
        .findById(account_id)
        .select(
          '-password -_id -created_at -updated_at -username -role -employee_number',
        )
        .exec();
      await this?.accountHelper?.class?.isNoAccountFound(!existingAccount);

      if (existingAccount.approved_by || existingAccount.approved_at) {
        throw new HttpException(
          {
            status: 'error',
            message: `Account is already ${existingAccount?.is_approved ? 'approved' : 'rejected'}.`,
            data: [],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedAccount = await this.accountModel
        .findByIdAndUpdate(
          account_id,
          {
            approved_by,
            approved_at: new Date(),
            updated_at: new Date(),
          },
          { new: true },
        )
        .select('-password')
        .lean()
        .exec();

      const result = [updatedAccount].map(this.accountHelper.map);

      await this.cacheManager.del('accounts');
      await this.cacheManager.del(`account_by_account_id_${account_id}`);

      return {
        status: 'success',
        message: 'Rejected account successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async changeRole(
    change_by: string,
    account_id: string,
    req: ChangeRoleDto,
  ): Promise<ResponseFormat<TRESAccunt>> {
    try {
      await ValidatorUtils.validate(ChangeRoleDto, req);

      const roles = ['admin', 'user', 'viewer', '', 'owner'];
      if (!roles.includes(req.role)) {
        throw new HttpException(
          {
            status: 'error',
            message: `Invalid role "${req.role}". Allowed roles are: ${roles.join(', ')}`,
            data: [],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (change_by === 'admin' && req.role === 'owner') {
        throw new HttpException(
          {
            status: 'error',
            message: `You are not allowed to change an admin account to owner.`,
            data: [],
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const existingAccount =
        await this.accountHelper.class.findAccountByAccountID(
          this?.accountModel,
          account_id,
        );
      await this?.accountHelper?.class?.isNoAccountFound(!existingAccount);

      if (existingAccount.role === req.role) {
        throw new HttpException(
          {
            status: 'error',
            message: `The account already has the role "${req.role}".`,
            data: [],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const dto = await ChangeRoleDto?.changeWithRole(req);
      const updatedAccount = await this.accountModel
        .findByIdAndUpdate(account_id, dto, { new: true })
        .select('-password')
        .lean()
        .exec();
      const result = [updatedAccount].map(this.accountHelper.map);

      await this.cacheManager.del('accounts');
      await this.cacheManager.del(
        `account_by_account_id_${result[0]?.account_id}`,
      );

      return {
        status: 'success',
        message: 'Changed role successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async resetPassword(account_id: string): Promise<ResponseFormat<TRESAccunt>> {
    try {
      const existingAccount =
        await this.accountHelper.class.findAccountByAccountID(
          this?.accountModel,
          account_id,
        );
      await this?.accountHelper?.class?.isNoAccountFound(!existingAccount);
      if (existingAccount.password && existingAccount.password !== '') {
        throw new HttpException(
          {
            status: 'error',
            message:
              'Cannot reset password. Password is already set. (Only accounts with an empty password can be reset)',
            data: [],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await BcryptUtils.hashPassword('111111');
      const updatedAccount = await this.accountModel
        .findByIdAndUpdate(
          account_id,
          { password: hashedPassword },
          { new: true },
        )
        .select('-password')
        .lean()
        .exec();
      const result = [updatedAccount].map(this.accountHelper.map);

      return {
        status: 'success',
        message: 'Reset password successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async update(
    account_id: string,
    req: UpdateAccountDto,
  ): Promise<ResponseFormat<AccountDocument | TRESAccunt>> {
    try {
      const profilePicture = req?.profile_picture;

      if (
        profilePicture &&
        profilePicture instanceof Object &&
        'buffer' in profilePicture
      ) {
        const res = await await this.microServiceUplode.uploadFile(
          'ptms/images/profile',
          profilePicture,
        );
        req = { ...req, profile_picture: res?.name ?? '' };
      }

      await ValidatorUtils.validate(UpdateAccountDto, req);

      const existingAccount = await this.accountModel
        .findById(account_id)
        .select(
          '-password -_id -created_at -updated_at -username -role -employee_number -deleted_by -deleted_at -is_deleted -approved_by -approved_at -is_approved -created_by',
        )
        .exec();
      await this?.accountHelper?.class?.isNoAccountFound(!existingAccount);

      if (
        String(req?.profile_picture)?.includes(
          `${process.env.BASE_FILE_IMAGES}`,
        )
      ) {
        req = {
          ...req,
          profile_picture: existingAccount?.profile_picture,
        };
      }

      const dto = await UpdateAccountDto?.format(req);
      const isSame = Object.keys(existingAccount.toObject()).every((key) => {
        return existingAccount[key] === dto[key];
      });

      if (isSame) {
        return {
          status: 'success',
          message:
            'Unable to update information because the information has not changed.',
          data: [existingAccount],
        };
      }

      const updatedAccount = await this.accountModel
        .findByIdAndUpdate(account_id, dto, { new: true })
        .select('-password')
        .lean()
        .exec();
      const result = [updatedAccount].map(this.accountHelper.map);

      await this.cacheManager.del('accounts');

      return {
        status: 'success',
        message: 'Account updated successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async delete(
    deleted_by: string,
    account_id: string,
  ): Promise<ResponseFormat<TRESAccunt>> {
    try {
      const existingAccount = await this.accountModel
        .findById(account_id)
        .select(
          '-password -_id -created_at -updated_at -username -role -employee_number',
        )
        .exec();
      await this?.accountHelper?.class?.isNoAccountFound(!existingAccount);

      if (existingAccount.role === 'owner') {
        throw new HttpException(
          {
            status: 'error',
            message: 'Cannot delete owner account.',
            data: [],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (existingAccount.is_deleted) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Account is already deleted.',
            data: [],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedAccount = await this.accountModel
        .findByIdAndUpdate(
          account_id,
          {
            is_deleted: true,
            deleted_by,
            deleted_at: new Date(),
            updated_at: new Date(),
          },
          { new: true },
        )
        .select('-password')
        .lean()
        .exec();

      const result = [updatedAccount].map(this.accountHelper.map);

      await this.cacheManager.del('accounts');

      return {
        status: 'success',
        message: 'Account deleted successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }
}
