import { TRole } from "./auth";

export type TAccount = {
  account_id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  position: string;
  profile_picture: string;
  role: TRole;
  updated_at: string;
  created_at: string;
  created_by: string;
  is_approved: boolean;
  approved_at: string | null;
  approved_by: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  is_forgot_password: boolean;
};

export type TCreateAccount = {
  employee_number: string;
  first_name: string;
  last_name: string;
  position?: string;
  profile_picture?: null | File;
  username: string;
  password: string;
  role: TRole;
};

export type TChangeRole = {
  account_id: string;
  role: TRole;
};

export type TUpdateAccount = {
  account_id: string;
  first_name: string;
  last_name: string;
  position: string;
  profile_picture: string | null;
};

export type TIntroduceAccount = {
  first_name: string;
  last_name: string;
  position: string;
  profile_picture: string;
};
