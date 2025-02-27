export type TResponse<T> = {
  status: "success" | "error";
  statusCode: number;
  message: string;
  data: T;
};

export type TMessage<T> = {
  message: T;
};
