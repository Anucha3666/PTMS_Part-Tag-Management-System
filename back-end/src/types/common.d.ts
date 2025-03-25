export type ResponseFormat<T> = {
  status: 'success' | 'error';
  message: string;
  data: T[];
};

export type TRequest = {
  user: {
    account_id: string;
    employee_number: string;
    username: string;
    role: TRole;
  };
};

export type TRole = 'admin' | 'user' | 'viewer' | '' | null | 'owner';
