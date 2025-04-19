import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { TRequest } from 'src/types';
import { JwtAuthGuard, Roles, RolesGuard } from '../guards';
import { CreatePartDto, UpdatePartDto } from './part.dto';
import { PartService } from './part.service';

@Controller('part')
export class PartController {
  constructor(private readonly partService: PartService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin', 'owner')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'picture_std', maxCount: 1 },
        { name: 'packing', maxCount: 1 },
        { name: 'q_point', maxCount: 1 },
        { name: 'more_pictures', maxCount: 3 },
      ],
      {
        storage: memoryStorage(),
      },
    ),
  )
  @Post()
  create(
    @Request() req: TRequest,
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
    @Body() body: CreatePartDto,
  ) {
    const account_id = req.user.account_id;

    const packing_std = Number(body?.packing_std ?? 0) ?? 0;
    const picture_std = files['picture_std']?.[0] ?? null;
    const packing = files['packing']?.[0] ?? null;
    const q_point = files['q_point']?.[0] ?? null;
    const file_more_pictures = files['more_pictures'] ?? [];

    return this.partService.create({
      ...body,
      created_by: account_id,
      packing_std,
      picture_std,
      packing,
      q_point,
      more_pictures: file_more_pictures,
    });
  }

  @Get(':part_id')
  findOne(@Param('part_id') part_id: string) {
    return this.partService.findOne(part_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':part_id/change-history')
  findHistoryOfChanges(@Param('part_id') part_id: string) {
    return this.partService.findHistoryOfChanges(part_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin', 'owner')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'picture_std', maxCount: 1 },
        { name: 'packing', maxCount: 1 },
        { name: 'q_point', maxCount: 1 },
        { name: 'more_pictures', maxCount: 3 },
      ],
      {
        storage: memoryStorage(),
      },
    ),
  )
  @Put(':part_id')
  update(
    @Request() req: TRequest,
    @Param('part_id') part_id: string,
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
    @Body() body: UpdatePartDto,
  ) {
    const account_id = req?.user?.account_id;

    const packing_std = Number(body?.packing_std ?? 0) ?? 0;
    const picture_std =
      (files['picture_std']?.[0]
        ? files['picture_std']?.[0]
        : body?.picture_std) ?? null;
    const packing =
      (files['packing']?.[0] ? files['packing']?.[0] : body?.packing) ?? null;
    const q_point =
      (files['q_point']?.[0] ? files['q_point']?.[0] : body?.q_point) ?? null;
    const file_more_pictures = []?.concat(files['more_pictures'] ?? []);
    const more_pictures = []?.concat(body?.more_pictures ?? []);

    return this.partService.update(part_id, {
      ...body,
      created_by: account_id,
      packing_std,
      picture_std,
      packing,
      q_point,
      more_pictures: [...more_pictures, ...file_more_pictures],
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner')
  @Delete(':part_id')
  delete(@Request() req: TRequest, @Param('part_id') part_id: string) {
    const deleted_by = req?.user?.account_id;
    return this.partService.delete(deleted_by, part_id);
  }
}

@Controller('parts')
@UseGuards(JwtAuthGuard)
export class PartsController {
  constructor(private readonly partService: PartService) {}

  @Get()
  findAll() {
    return this.partService.findAll();
  }
}

// const account_id = req.user.account_id;

// return this.partService.create({
//   ...body,
//   created_by: account_id,
//   packing_std,
//   picture_std,
//   packing,
//   q_point,
//   more_pictures: [...more_pictures, ...file_more_pictures],
// });
