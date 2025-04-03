import { TRESTag } from './tag';

export type TRESPrinted = {
  printed_id: string;
  tags: TRESTag[];
  printed_by: string;
  printed_at: string;
};
