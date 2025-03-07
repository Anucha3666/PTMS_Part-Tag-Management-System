import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from './schemas/account.schema';
import { ResponseFormat } from 'src/types/common';

@Injectable()
export class AccountsService {
  private type: typeof Account;

  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {
    this.type = Account;
  }

  private async findEmployeeID(
    employee_id: string,
  ): Promise<InstanceType<typeof this.type>> {
    return this.accountModel.findOne({ employee_id }).exec();
  }

  async create(
    createAccountDto: CreateAccountDto,
  ): Promise<ResponseFormat<InstanceType<typeof this.type>>> {
    try {
      const dataUser = await this.findEmployeeID(createAccountDto?.employee_id);
      const alreadyUsed = (dataUser?.employee_id ?? '') !== '';

      if (alreadyUsed) {
        throw new HttpException(
          {
            status: 'error',
            message: `Employee ID ${createAccountDto.employee_id} is already in use.`,
            data: [dataUser],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const createdAccount = new this.accountModel({
        auth: null,
        ...createAccountDto,
      });

      const savedAccount = await createdAccount.save();

      return {
        status: 'success',
        message: 'Account created successfully.',
        data: [savedAccount],
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: 'error',
          message:
            'An error occurred while creating the account. Please try again later.',
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<ResponseFormat<InstanceType<typeof this.type>>> {
    try {
      const req = await this.accountModel.find().exec();

      if ((req?.length ?? 0) <= 0) {
        throw new HttpException(
          {
            status: 'error',
            message: 'No accounts found in the system.',
            data: [],
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        status: 'success',
        message: 'Accounts retrieved successfully.',
        data: req,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to retrieve accounts. Please try again later.',
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(
    id: string,
  ): Promise<ResponseFormat<InstanceType<typeof this.type>>> {
    try {
      const account = await this.accountModel.findById(id).exec();

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

      return {
        status: 'success',
        message: 'Account retrieved successfully.',
        data: [account],
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to retrieve the account. Please try again later.',
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<ResponseFormat<InstanceType<typeof this.type>>> {
    try {
      const updatedAccount = await this.accountModel
        .findByIdAndUpdate(
          id,
          { ...updateAccountDto, updated_at: new Date() },
          { new: true },
        )
        .exec();

      if (!updatedAccount) {
        throw new HttpException(
          {
            status: 'error',
            message: `Account with ID ${id} not found. Update operation failed.`,
            data: [],
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        status: 'success',
        message: 'Account updated successfully.',
        data: [updatedAccount],
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update the account. Please try again later.',
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(
    id: string,
  ): Promise<ResponseFormat<InstanceType<typeof this.type>>> {
    try {
      const deletedAccount = await this.accountModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedAccount) {
        throw new HttpException(
          {
            status: 'error',
            message: `Account with ID ${id} not found. Deletion failed.`,
            data: [],
          },
          HttpStatus.NOT_FOUND,
        );
      }

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
          message:
            'An error occurred during the deletion process. Please try again later.',
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
