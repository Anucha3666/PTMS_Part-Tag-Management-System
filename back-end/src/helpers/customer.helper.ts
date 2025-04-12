import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { CustomerDocument } from 'src/modules/customer/customer.entity';

export class ClassCustomerHelper {
  async findCustomerByCustomerName(
    customerModel: Model<CustomerDocument>,
    customer_name: string,
  ): Promise<CustomerDocument | null> {
    return customerModel.findOne({ customer_name }).exec();
  }

  async isNoCustomerFound(isNoCustomerFound: boolean) {
    if (isNoCustomerFound) {
      throw new HttpException(
        {
          status: 'error',
          message: `No customer found with this id.`,
          data: [],
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

export const mapRES = (customer: any) => ({
  customer_id: customer._id.toString(),
  customer_name: customer.customer_name,
  customer_description: customer.customer_description,
  logo: customer.logo,
  created_by: customer.created_by,
  updated_at: customer.updated_at,
  created_at: customer.created_at,
  is_deleted: customer.is_deleted,
  deleted_by: customer.deleted_by,
  deleted_at: customer.deleted_at,
  _id: undefined,
});

export const CustomerHelper = {
  class: new ClassCustomerHelper(),
  map: { res: mapRES },
};
