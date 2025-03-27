import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { PartDocument } from 'src/modules/part/part.entity';

export class ClassPartHelper {
  async findPartByPartNo(
    partModel: Model<PartDocument>,
    part_no: string,
  ): Promise<PartDocument | null> {
    return partModel.findOne({ part_no }).exec();
  }

  async findPartByPartID(
    partModel: Model<PartDocument>,
    _id: string,
  ): Promise<PartDocument | null> {
    return partModel.findOne({ _id }).exec();
  }

  async isNoAccountFound(isNoAccountFound: boolean) {
    if (isNoAccountFound) {
      throw new HttpException(
        {
          status: 'error',
          message: `No part found with this id.`,
          data: [],
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

const mapRES = (data: any) => ({
  part: data._id.toString(),
  ...data,
  _id: undefined,
});

export const PartHelper = {
  class: new ClassPartHelper(),
  map: { res: mapRES },
};
