import { TRole } from "./auth";

export type TAccount = {
  account_id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  role: TRole;
  position: string;
  profile_picture: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_approved: boolean;
  approved_at: string;
  approved_by: string;
  is_deleted: boolean;
  deleted_at: boolean;
  deleted_by: string;
};
