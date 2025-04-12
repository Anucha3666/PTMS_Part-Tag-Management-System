import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { CommonHelper } from 'src/helpers';
import { CustomerHelper } from 'src/helpers/customer.helper';
import { MicroServiceUplode } from 'src/services';
import { TRESCustomer } from 'src/types';
import { ResponseFormat } from 'src/types/common';
import { ValidatorUtils } from 'src/utils';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';
import { Customer, CustomerDocument } from './customer.entity';

@Injectable()
export class CustomerService {
  commonHelper = CommonHelper;
  customerHelper = CustomerHelper;

  constructor(
    private readonly microServiceUplode: MicroServiceUplode,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(req: CreateCustomerDto): Promise<ResponseFormat<TRESCustomer>> {
    try {
      const logoPicture = req?.logo;

      if (
        logoPicture &&
        logoPicture instanceof Object &&
        'buffer' in logoPicture
      ) {
        const res = await await this.microServiceUplode.uploadFile(
          'ptms/images/customer_logo',
          logoPicture,
        );
        req = { ...req, logo: res?.name ?? null };
      }

      await ValidatorUtils.validate(CreateCustomerDto, req);

      const existingCustomer =
        await this.customerHelper.class.findCustomerByCustomerName(
          this?.customerModel,
          req?.customer_name,
        );

      if (existingCustomer) {
        let duplicateField = '';

        if (existingCustomer.customer_name === req.customer_name) {
          duplicateField = `Customer Name "${req.customer_name}"`;
        }

        throw new HttpException(
          {
            status: 'error',
            message: `${duplicateField} is already in use. Please choose a different one.`,
            data: [existingCustomer]?.map(this.customerHelper.map.res),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const dto = await CreateCustomerDto.format(req);
      const customer = new this.customerModel(dto);
      const savedCustomer = await customer.save();
      const result = [savedCustomer].map(this.customerHelper.map.res);

      await this.cacheManager.del('customers');

      return {
        status: 'success',
        message: 'Customer created successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async findAll(): Promise<ResponseFormat<TRESCustomer>> {
    try {
      const cachedCustomers =
        await this.cacheManager.get<TRESCustomer[]>('customers');
      if (cachedCustomers) {
        return {
          status: 'success',
          message: 'Customers retrieved from cache.',
          data: cachedCustomers,
        };
      }

      const customers = await this.customerModel
        .find()
        .lean()
        .sort({ created_at: -1 })
        .exec();

      if ((customers?.length ?? 0) <= 0) {
        throw new HttpException(
          {
            status: 'error',
            message: 'No customers found in the system.',
            data: [],
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const result = customers.map(this.customerHelper.map.res);
      await this.cacheManager.set('customers', result);

      return {
        status: 'success',
        message: 'Customers retrieved successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async update(
    customer_id: string,
    req: UpdateCustomerDto,
  ): Promise<ResponseFormat<CustomerDocument | TRESCustomer>> {
    try {
      const logoPicture = req?.logo;

      if (
        logoPicture &&
        logoPicture instanceof Object &&
        'buffer' in logoPicture
      ) {
        const res = await await this.microServiceUplode.uploadFile(
          'ptms/images/customer_logo',
          logoPicture,
        );
        req = { ...req, logo: res?.name ?? '' };
      }

      await ValidatorUtils.validate(UpdateCustomerDto, req);

      const existingCustomer = await this.customerModel
        .findById(customer_id)
        .select(
          '-_id -created_at -updated_at -deleted_by -deleted_at -is_deleted -created_by',
        )
        .exec();
      await this?.customerHelper?.class?.isNoCustomerFound(!existingCustomer);

      if (String(req?.logo)?.includes(`${process.env.BASE_FILE_IMAGES}`)) {
        req = {
          ...req,
          logo: existingCustomer?.logo,
        };
      }

      const dto = await UpdateCustomerDto?.format(req);
      const isSame = Object.keys(existingCustomer.toObject()).every((key) => {
        return existingCustomer[key] === dto[key];
      });

      if (isSame) {
        return {
          status: 'success',
          message:
            'Unable to update information because the information has not changed.',
          data: [existingCustomer],
        };
      }

      const updatedCustomer = await this.customerModel
        .findByIdAndUpdate(customer_id, dto, { new: true })
        .lean()
        .exec();
      const result = [updatedCustomer].map(this.customerHelper.map.res);

      await this.cacheManager.del('customers');

      return {
        status: 'success',
        message: 'Customer updated successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async delete(
    deleted_by: string,
    customer_id: string,
  ): Promise<ResponseFormat<TRESCustomer>> {
    try {
      const existingCustomer = await this.customerModel
        .findById(customer_id)
        .select('-_id -created_at -updated_at')
        .exec();
      await this?.customerHelper?.class?.isNoCustomerFound(!existingCustomer);

      if (existingCustomer.is_deleted) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Customer is already deleted.',
            data: [],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedCustomer = await this.customerModel
        .findByIdAndUpdate(
          customer_id,
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

      const result = [updatedCustomer].map(this.customerHelper.map.res);

      await this.cacheManager.del('customers');

      return {
        status: 'success',
        message: 'Customer deleted successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }
}
