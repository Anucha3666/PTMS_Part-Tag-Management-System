export type TPrintedTag = {
  printed_id: string;
  process: string;
  tags: string[];
  summary: TPrintedTagSummary[];
  printed_by: string;
  printed_at: string;
};

export type TPrintedTagSummary = {
  part_id: string;
  customer_name?: string;
  customer?: {
    customer_id: string;
    customer_name: string;
    logo: string | null;
  } | null;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  number_of_tags: number;
};
