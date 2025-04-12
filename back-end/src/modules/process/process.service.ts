import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { CommonHelper, ProcessHelper } from 'src/helpers';
import { MicroServiceUplode } from 'src/services';
import { TRESProcess } from 'src/types';
import { ResponseFormat } from 'src/types/common';
import { ValidatorUtils } from 'src/utils';
import { CreateProcessDto, UpdateProcessDto } from './process.dto';
import { Process, ProcessDocument } from './process.entity';

@Injectable()
export class ProcessService {
  commonHelper = CommonHelper;
  processHelper = ProcessHelper;

  constructor(
    private readonly microServiceUplode: MicroServiceUplode,
    @InjectModel(Process.name) private processModel: Model<ProcessDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(req: CreateProcessDto): Promise<ResponseFormat<TRESProcess>> {
    try {
      await ValidatorUtils.validate(CreateProcessDto, req);

      const existingProcess =
        await this.processHelper.class.findProcessByProcessName(
          this?.processModel,
          req?.process_name,
        );

      if (existingProcess) {
        let duplicateField = '';

        if (existingProcess.process_name === req.process_name) {
          duplicateField = `Process Name "${req.process_name}"`;
        }

        throw new HttpException(
          {
            status: 'error',
            message: `${duplicateField} is already in use. Please choose a different one.`,
            data: [existingProcess]?.map(this.processHelper.map.res),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const dto = await CreateProcessDto.format(req);
      const process = new this.processModel(dto);
      const savedProcess = await process.save();
      const result = [savedProcess].map(this.processHelper.map.res);

      await this.cacheManager.del('processs');

      return {
        status: 'success',
        message: 'Process created successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async findAll(): Promise<ResponseFormat<TRESProcess>> {
    try {
      const cachedProcesss =
        await this.cacheManager.get<TRESProcess[]>('processs');
      if (cachedProcesss) {
        return {
          status: 'success',
          message: 'Processs retrieved from cache.',
          data: cachedProcesss,
        };
      }

      const processs = await this.processModel
        .find()
        .lean()
        .sort({ created_at: -1 })
        .exec();

      if ((processs?.length ?? 0) <= 0) {
        throw new HttpException(
          {
            status: 'error',
            message: 'No processs found in the system.',
            data: [],
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const result = processs.map(this.processHelper.map.res);
      await this.cacheManager.set('processs', result);

      return {
        status: 'success',
        message: 'Processs retrieved successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async update(
    process_id: string,
    req: UpdateProcessDto,
  ): Promise<ResponseFormat<ProcessDocument | TRESProcess>> {
    try {
      await ValidatorUtils.validate(UpdateProcessDto, req);

      const existingProcess = await this.processModel
        .findById(process_id)
        .select(
          '-_id -created_at -updated_at -deleted_by -deleted_at -is_deleted -created_by',
        )
        .exec();
      await this?.processHelper?.class?.isNoProcessFound(!existingProcess);

      const dto = await UpdateProcessDto?.format(req);
      const isSame = Object.keys(existingProcess.toObject()).every((key) => {
        return existingProcess[key] === dto[key];
      });

      if (isSame) {
        return {
          status: 'success',
          message:
            'Unable to update information because the information has not changed.',
          data: [existingProcess],
        };
      }

      const updatedProcess = await this.processModel
        .findByIdAndUpdate(process_id, dto, { new: true })
        .lean()
        .exec();
      const result = [updatedProcess].map(this.processHelper.map.res);

      await this.cacheManager.del('processs');

      return {
        status: 'success',
        message: 'Process updated successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }

  async delete(
    deleted_by: string,
    process_id: string,
  ): Promise<ResponseFormat<TRESProcess>> {
    try {
      const existingProcess = await this.processModel
        .findById(process_id)
        .select('-_id -created_at -updated_at')
        .exec();
      await this?.processHelper?.class?.isNoProcessFound(!existingProcess);

      if (existingProcess.is_deleted) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Process is already deleted.',
            data: [],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedProcess = await this.processModel
        .findByIdAndUpdate(
          process_id,
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

      const result = [updatedProcess].map(this.processHelper.map.res);

      await this.cacheManager.del('processs');

      return {
        status: 'success',
        message: 'Process deleted successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }
}
