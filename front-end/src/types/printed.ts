import { TTag } from "./tag";

export type TPrintedTag = {
  printed_id: string;
  tags: string[];
  summary: TPrintedTagSummary[];
  printed_by: string;
  printed_at: string;
};

export type TPrintedTagSummary = {
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  number_of_tags: number;
};

export type TPrinted = {
  printed_id: string;
  data: TTag[];
  printed_by: string;
  create_at: string;
};
