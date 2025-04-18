export type TPart = {
  part_id: string;
  customer: {
    customer_id: string;
    customer_name: string;
    logo: string | null;
  } | null;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string | null;

  q_point: string | null;
  packing: string | null;
  more_pictures: string[];
  created_at: string;
  created_by: string;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
};

export type TPartChangeHistory = {
  part_id: string;
  customer: {
    customer_id: string;
    customer_name: string;
    logo: string | null;
  } | null;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string | null;
  q_point: string | null;
  packing: string | null;
  more_pictures: string[];
  is_log: boolean;
  created_at: string;
  created_by: string;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
};

export type TCreatePart = {
  customer_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string | File;
  q_point: string | File;
  packing: string | File;
  more_pictures: (string | File)[];
};

export type TUpdatePart = {
  part_id: string;
  customer_id: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  q_point: string;
  packing: string;
  more_pictures: string[];
};
