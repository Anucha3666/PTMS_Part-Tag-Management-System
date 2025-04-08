export type TRESTag = {
  printed_id: string;
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  q_point: string;
  packing: string;
  more_pictures: string[] | [];
  created_at: string;
  created_by: string;
  printed_by: string;
  printed_at: string;
  tag_no: string;
  ref_tag: string;
  checked_at: string;
  checked_by: string;
};

export type TRESTagValidation = {
  tag_id: string;
  printed_id: string;
  part_id: string;
  tag_no: string;
  ref_tag: string;
  checked_at: string;
  checked_by: string;
};

export type TREQTagValidationBody = { type: string; ref_tag: string };

export type TREQTagValidation = TREQTagValidationBody & {
  tag_no: string;
  checked_by: string;
};
