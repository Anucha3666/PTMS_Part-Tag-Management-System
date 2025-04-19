import { TRESPart } from './part';

export type TRESTag = {
  tag_id: string;
  printed_id: string;
  process: string;
  customer_name?: string;
  printed_by: string | any;
  printed_at: string;
  tag_no: string;
  ref_tag: string;
  checked_at: string;
  checked_by: string | any;
  part: TRESPart;
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
