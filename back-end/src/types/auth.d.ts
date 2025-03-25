import { TRole } from './common';

export type TRESSignIn = {
  account_id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  username: string;
  role: TRole;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
  token: string;
};
