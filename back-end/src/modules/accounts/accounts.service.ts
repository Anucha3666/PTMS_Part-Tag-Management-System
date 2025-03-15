import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { AccountHelper } from 'src/helpers/accounts.helper';
import { TRESAccunt } from 'src/types';
import { ResponseFormat } from 'src/types/common';
import { ValidatorUtils } from 'src/utils';
import { Account, AccountDocument } from './account.entity';
import { CreateAccountDto, UpdateAccountDto } from './accounts.dto';

@Injectable()
export class AccountsService {
  accountHelper = AccountHelper;
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    req: CreateAccountDto,
  ): Promise<ResponseFormat<AccountDocument>> {
    try {
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
            data: [existingAccount],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const dto = await CreateAccountDto.createWithHashedPassword(req);
      const account = new this.accountModel(dto);
      const savedAccount = await account.save();
      const result = [savedAccount?.toObject()].map(this.accountHelper.map);

      return {
        status: 'success',
        message: 'Account created successfully.',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          status: 'error',
          message: `Create account: ${error.message}`,
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          status: 'error',
          message: `Find all accounts: ${error.message}`,
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<ResponseFormat<TRESAccunt>> {
    try {
      const CACHE_KEY = `account_by_employee_number_${id}`;

      const cachedAccount =
        await this.cacheManager.get<TRESAccunt[]>(CACHE_KEY);
      if (cachedAccount) {
        return {
          status: 'success',
          message: 'Account retrieved from cache.',
          data: cachedAccount,
        };
      }

      const account = await this.accountModel
        .findById(id)
        .select('-password')
        .lean()
        .exec();
      if (!account) {
        throw new HttpException(
          {
            status: 'error',
            message: `Account with ID ${id} not found.`,
            data: [],
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const result = [account].map(this.accountHelper.map);
      await this.cacheManager.set(CACHE_KEY, result);

      return {
        status: 'success',
        message: 'Account retrieved successfully.',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          status: 'error',
          message: `Find one account: ${error.message}`,
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    req: UpdateAccountDto,
  ): Promise<ResponseFormat<AccountDocument | TRESAccunt>> {
    try {
      await ValidatorUtils.validate(UpdateAccountDto, req);

      const existingAccount = await this.accountModel
        .findById(id)
        .select(
          '-password -_id -created_at -updated_at -username -role -employee_number',
        )
        .exec();
      if (!existingAccount) {
        throw new HttpException(
          {
            status: 'error',
            message: `No account found with this id.`,
            data: [],
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const dto = await UpdateAccountDto?.createWithUpdatedAt(req);
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
        .findByIdAndUpdate(id, dto, { new: true })
        .select('-password')
        .lean()
        .exec();
      const result = [updatedAccount].map(this.accountHelper.map);

      await this.cacheManager.del('accounts');
      await this.cacheManager.del(`account_by_employee_number_${id}`);

      return {
        status: 'success',
        message: 'Account updated successfully.',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          status: 'error',
          message: `Update account: ${error.message}`,
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string): Promise<ResponseFormat<AccountDocument>> {
    try {
      // const account = await this.accountModel.findById(id).exec();

      const deletedAccount = await this.accountModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedAccount) {
        throw new HttpException(
          {
            status: 'error',
            message: `Account with ID ${id} not found.`,
            data: [],
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await this.cacheManager.del('accounts');
      await this.cacheManager.del(`account_by_employee_number_${id}`);
      return {
        status: 'success',
        message: 'Account deleted successfully.',
        data: [deletedAccount],
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          status: 'error',
          message: `Delete account: ${error.message}`,
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
