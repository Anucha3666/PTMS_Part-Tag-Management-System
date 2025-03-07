export type ResponseFormat<T> = {
  status: 'success' | 'error';
  message: string;
  data: T[];
};
