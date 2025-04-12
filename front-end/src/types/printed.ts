export type TPrintedTag = {
  printed_id: string;
  tags: string[];
  summary: TPrintedTagSummary[];
  printed_by: string;
  printed_at: string;
};

export type TPrintedTagSummary = {
  part_id: string;
  customer_name: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  number_of_tags: number;
};
