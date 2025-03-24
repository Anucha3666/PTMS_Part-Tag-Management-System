export type TRole = "admin" | "user" | "viewer" | "owner" | "" | null;

export type TSignIn = {
  username: string;
  password: string;
  remember?: string;
};

export type TChangePassword = {
  username: string;
  old_password: string;
  new_password: string;
};

export type TLogin = {
  username: string;
  password: string;
  remember?: string;
};

export type TSignUp = {
  employee_number: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
};

export type TAuth = {
  account_id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  username: string;
  position: string;
  profile_picture: string | null;
  role: TRole;
  created_at: string;
  updated_at: string;
  token: string;
};

export type TCreateTempEmployee = {
  username: string;
  prior_name: string;
  first_name: string;
  last_name: string;
  section: string;
  department: string;
  position: string;
  company_code: string;
  job_start: string; //! "2024-01-01";
  // resign_status: "1";
};

export type TCreateUpdateUser = {
  username: string;
  role: TRole;
};

export type TDataLoginShortcut = {
  username: string;
  password: string;
  full_name: string;
  pin: string;
};
