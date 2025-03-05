export type TPrintTag = {
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  no_tags: number;
};

export type TPrintingHistorys = {
  _id: string;
  data: TPrintTag[];
  printed_by: string;
  create_at: string;
};
