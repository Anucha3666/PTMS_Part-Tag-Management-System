export type TRole = "admin" | "user" | "viewer" | "owner" | "" | null;

export type TSignIn = {
  username: string;
  password: string;
  remember?: string;
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

export type TForgotPassword = {
  employee_number: string;
  username: string;
};

export type TChangePassword = {
  password: string;
  new_password: string;
};
