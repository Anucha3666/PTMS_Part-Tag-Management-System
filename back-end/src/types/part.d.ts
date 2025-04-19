export type TRESPart = {
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  customer_name?: string;
  picture_std: string;
  q_point: string;
  packing: string;
  more_pictures: string[] | [];
  created_at: string;
  created_by: string;
  is_deleted: boolean;
  deleted_by: string;
  deleted_at: string;
  // is_log: boolean;
};
export type TRESPartChangeHistory = {
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  q_point: string;
  packing: string;
  customer: {
    customer_id: string;
    customer_name: string;
    logo: string | null;
  } | null;
  more_pictures: string[] | [];
  is_log: boolean;
  created_at: string;
  created_by: string;
  is_deleted: boolean;
  deleted_at: string;
  deleted_by: string;
};
