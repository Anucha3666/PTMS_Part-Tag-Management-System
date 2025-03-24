import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { AccountHelper, AuthHelper } from 'src/helpers';
import { TRESSignIn } from 'src/types';
import { ResponseFormat } from 'src/types/common';
import { BcryptUtils, ValidatorUtils } from 'src/utils';
import { Account, AccountDocument } from '../accounts/account.entity';
import {
  ChangePasswordDto,
  ChangeRoleDto,
  SignInDto,
  SignUpDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  authHelper = AuthHelper;
  accountHelper = AccountHelper;

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async generateToken(user: AccountDocument): Promise<string> {
    const payload = {
      account_id: user?._id?.toString(),
      employee_number: user?.employee_number,
      username: user.username,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async signIn(req: SignInDto): Promise<ResponseFormat<TRESSignIn>> {
    try {
      await ValidatorUtils.validate(SignInDto, req);

      const existingAccount =
        await this.accountHelper.class.findAccountByUsername(
          this?.accountModel,
          req?.username,
        );
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

      const isVedifind = await BcryptUtils?.comparePassword(
        req?.password,
        existingAccount?.password,
      );
      const isWaitingForConfirmation =
        (existingAccount?.is_approved ?? false) === false;
      const isBlock = (existingAccount?.role ?? '') === '';
      const isDeleted = (existingAccount?.is_deleted ?? false) === true;
      if (!isVedifind || isWaitingForConfirmation || isBlock || isDeleted) {
        throw new HttpException(
          {
            status: 'error',
            message: !isVedifind
              ? `Invalid username or password.`
              : isWaitingForConfirmation
                ? 'Your account is pending approval. Please wait for confirmation.'
                : isBlock
                  ? 'Your account has been blocked. Please contact support for assistance.'
                  : 'Your account has been deleted. Please contact support for assistance.', // เพิ่มตรงนี้
            data: [],
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const token = await this?.generateToken(existingAccount);
      const result = [existingAccount?.toObject()]
        .map(this.accountHelper.mapSignIn)
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
        { status: 'error', message: `Sign in: ${error.message}`, data: [] },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signUp(req: SignUpDto): Promise<ResponseFormat<AccountDocument>> {
    try {
      await ValidatorUtils.validate(SignUpDto, req);

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

      const dto = await SignUpDto.createWithHashedPassword(req);
      const account = new this.accountModel(dto);
      const savedAccount = await account.save();
      const updatedAccount = await this.accountModel
        .findByIdAndUpdate(
          savedAccount?._id,
          { created_by: savedAccount?._id },
          { new: true },
        )
        .select('-password')
        .lean()
        .exec();

      const result = [updatedAccount].map(this.accountHelper.map);

      return {
        status: 'success',
        message: 'Account sign up successfully.',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { status: 'error', message: `Sign up: ${error.message}`, data: [] },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changeRole(
    account_id: string,
    req: ChangeRoleDto,
  ): Promise<ResponseFormat<AccountDocument>> {
    try {
      await ValidatorUtils.validate(ChangeRoleDto, req);

      const existingAccount =
        await this.accountHelper.class.findAccountByAccountID(
          this?.accountModel,
          account_id,
        );
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

      const dto = await ChangeRoleDto?.changeWithRole(req);
      const updatedAccount = await this.accountModel
        .findByIdAndUpdate(account_id, dto, { new: true })
        .select('-password')
        .lean()
        .exec();
      const result = [updatedAccount].map(this.accountHelper.map);

      return {
        status: 'success',
        message: 'Changed role successfully.',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          status: 'error',
          message: `Change role: ${error.message}`,
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(
    account_id: string,
  ): Promise<ResponseFormat<AccountDocument>> {
    try {
      const existingAccount =
        await this.accountHelper.class.findAccountByAccountID(
          this?.accountModel,
          account_id,
        );
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
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          status: 'error',
          message: `Change role: ${error.message}`,
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(
    account_id: string,
    req: ChangePasswordDto,
  ): Promise<ResponseFormat<AccountDocument>> {
    try {
      await ValidatorUtils.validate(ChangePasswordDto, req);

      const existingAccount =
        await this.accountHelper.class.findAccountByAccountID(
          this?.accountModel,
          account_id,
        );
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

      const isVedifind = await BcryptUtils?.comparePassword(
        req?.password,
        existingAccount?.password,
      );
      if (!isVedifind) {
        throw new HttpException(
          {
            status: 'error',
            message: `Invalid password.`,
            data: [],
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const hashedPassword = await BcryptUtils.hashPassword(req?.new_password);
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
        message: 'Change password successfully.',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          status: 'error',
          message: `Change role: ${error.message}`,
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
