export type TRESPart = {
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  q_point: string;
  packing: string;
  more_pictures: string[] | [];
  is_log: boolean;
  created_at: string;
  created_by: string;
  is_deleted: boolean;
  deleted_at: string;
  deleted_by: string;
};
