import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { ProcessDocument } from 'src/modules/process/process.entity';

export class ClassProcessHelper {
  async findProcessByProcessName(
    processModel: Model<ProcessDocument>,
    process_name: string,
  ): Promise<ProcessDocument | null> {
    return processModel.findOne({ process_name }).exec();
  }

  async isNoProcessFound(isNoProcessFound: boolean) {
    if (isNoProcessFound) {
      throw new HttpException(
        {
          status: 'error',
          message: `No process found with this id.`,
          data: [],
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

export const mapRESProcess = (process: any) => ({
  process_id: process._id.toString(),
  process_name: process.process_name,
  process_description: process.process_description,
  created_by: process.created_by,
  updated_at: process.updated_at,
  created_at: process.created_at,
  is_deleted: process.is_deleted,
  deleted_by: process.deleted_by,
  deleted_at: process.deleted_at,
  _id: undefined,
});

export const ProcessHelper = {
  class: new ClassProcessHelper(),
  map: { res: mapRESProcess },
};
