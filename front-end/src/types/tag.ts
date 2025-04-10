export type TTag = {
  tag_id: string;
  printed_id: string;
  tag_no: string;
  ref_tag: string | null;
  checked_by: string | null;
  checked_at: string | null;
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string | null;
  q_point: string | null;
  packing: string | null;
  more_pictures: string[];
  is_log: boolean;
  created_by: string;
  created_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
};

export type TValidationTag = {
  tag_no: string;
  type: "daikin";
  ref_tag: string;
};
