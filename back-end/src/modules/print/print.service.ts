import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonHelper, PartHelper, PrintedHelper } from 'src/helpers';
import { TRESPrinted } from 'src/types';
import { ResponseFormat } from 'src/types/common';
import { ValidatorUtils } from 'src/utils';
import { Part, PartDocument } from '../part/part.entity';
import { Printed, PrintedDocument } from '../printed/printed.entity';
import { Tag, TagDocument } from '../tag/tag.entity';
import { CreatePrintDto } from './print.dto';

@Injectable()
export class PrintService {
  commonHelper = CommonHelper;
  printedHelper = PrintedHelper;
  partHelper = PartHelper;

  constructor(
    @InjectModel(Printed.name) private printedModel: Model<PrintedDocument>,
    @InjectModel(Part.name) private partModel: Model<PartDocument>,
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async createTag(data: Partial<Tag>): Promise<Tag> {
    const lastTag = await this.tagModel.findOne().sort({ tag_no: -1 }).exec();

    const lastNumber = lastTag?.tag_no ?? 'A00000';
    const newTagNumber =
      await this?.commonHelper?.incrementTagNumber(lastNumber);

    const createdTag = new this.tagModel({
      ...data,
      tag_no: newTagNumber,
    });

    return createdTag.save();
  }

  async printTags(
    req: CreatePrintDto,
  ): Promise<ResponseFormat<PrintedDocument | TRESPrinted>> {
    try {
      await ValidatorUtils.validate(CreatePrintDto, req);

      const partIds = req.parts.map((item) => item.part_id);
      const existingParts = await this?.partHelper?.class?.findleanPartByPartID(
        this.partModel,
        partIds,
      );
      const existingPartIds = existingParts.map((part) => part._id.toString());
      const notFound = partIds.filter((id) => !existingPartIds.includes(id));
      if (notFound.length > 0) {
        this?.commonHelper?.httpExceptionError(
          `Part IDs not found: ${notFound.join(', ')}`,
        );
      }

      const dto = await CreatePrintDto.formatCreatePrinted(req);
      const parted = new this.printedModel(dto);
      const savedParted = await parted.save();
      const dataPrinted = [savedParted?.toObject()].map(
        this.printedHelper.map.res,
      )[0];

      const dtoCreateTags = await CreatePrintDto.formatCreateTags(
        dataPrinted?.printed_id,
        req?.parts,
      );

      const tags = [];

      for (const tag of dtoCreateTags) {
        const createdTag = await this.createTag(tag);
        tags.push(createdTag.tag_no);
      }

      console.log(dataPrinted?.printed_id);
      console.log(tags);

      const updatedParted = await this.printedModel.findByIdAndUpdate(
        dataPrinted?.printed_id,
        { tags: tags },
        { new: true },
      );

      const result = [updatedParted?.toObject()].map(
        this.printedHelper.map.res,
      );

      return {
        status: 'success',
        message: 'Part created successfully.',
        data: result,
      };
    } catch (error) {
      this.commonHelper.handleError(error);
    }
  }
}
