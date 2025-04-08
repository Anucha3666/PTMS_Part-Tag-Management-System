import { TRESTag } from './tag';

export type TRESPrinted = {
  printed_id: string;
  tags: TRESTag[];
  printed_by: string;
  printed_at: string;
};

export type TPrintedSummary = {
  part_id: string;
  part_no: string;
  part_name: string;
  picture_std: string;
  packing_std: number;
  number_of_tags: number;
};
