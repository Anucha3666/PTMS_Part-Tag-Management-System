export type ResponseFormat<T> = {
  status: 'success' | 'error';
  message: string;
  data: T[];
};

export type TRole = 'admin' | 'user' | 'viewer' | '' | null | 'owner';
