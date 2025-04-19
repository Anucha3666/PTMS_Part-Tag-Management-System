import { TPart } from "./part";

export type TTag = {
  tag_id: string;
  printed_id: string;
  process: string;
  printed_by: string;
  printed_at: string;
  tag_no: string;
  ref_tag: string;
  checked_at: string;
  checked_by: string;
  part: TPart;
};

export type TTagView = {
  tag_id: string;
  printed_id: string;
  printed_by: {
    employee_number: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  };
  printed_at: string;
  tag_no: string;
  ref_tag: string;
  checked_at: string;
  checked_by: {
    employee_number: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  };
  part: TPart;
};

export type TValidationTag = {
  tag_no: string;
  type: "daikin";
  ref_tag: string;
};
