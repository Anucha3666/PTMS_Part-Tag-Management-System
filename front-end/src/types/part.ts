import { TIntroduceAccount } from "./account";

export type TPart = {
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  q_point: string;
  packing: string;
  more_pictures: string[];
  updated_at: string;
  created_at: string;
};

export type TPartDetails = {
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  q_point: string;
  packing: string;
  more_pictures: string[];
  created_at: string;
  created_by: TIntroduceAccount;
  is_log: boolean;
  updated_at: string;
  updated_by: TIntroduceAccount;
  is_deleted: boolean;
  deleted_at: string;
  deleted_by: TIntroduceAccount;
};

export type TPartChangeHistory = {
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  q_point: string;
  packing: string;
  more_pictures: string[];
  created_at: string;
  created_by: TIntroduceAccount;
  is_log: boolean;
  updated_at: string;
  updated_by: TIntroduceAccount;
  is_deleted: boolean;
  deleted_at: string;
  deleted_by: TIntroduceAccount;
};

export type TCreatePart = {
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  q_point: string;
  packing: string;
  more_pictures: string[];
};

export type TUpdatePart = {
  part_id: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  q_point: string;
  packing: string;
  more_pictures: string[];
};
