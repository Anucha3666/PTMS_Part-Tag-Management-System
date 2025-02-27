export type TCerateUpdatePart = {
  part_id?: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  q_point: string;
  packing: string;
  more_pictures: string[];
};

export type TPart = {
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  q_point: string;
  packing: string;
  more_pictures: string[];
  creator: string;
  create_at: string;
  update_at: string;
};
