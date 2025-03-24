export type TResponse<T> = {
  status: "success" | "error";
  message: string;
  data: T;
};

export type TMessage<T> = {
  message: T;
};
