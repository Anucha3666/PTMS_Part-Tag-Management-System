import { TIntroduceAccount } from "./account";

export type TTag = {
  tag_id: string;
  tag_number: string;
  part_id: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  is_checked: boolean;
  checked_at: string;
  checked_by: TIntroduceAccount;
};
