import { TTag } from "./tag";

export type TPrintedTag = {
  tag_id: string;
  tag_number: string;
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  created_at: string;
};

export type TPrinted = {
  printed_id: string;
  data: TTag[];
  printed_by: string;
  create_at: string;
};
