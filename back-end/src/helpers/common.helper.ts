import { HttpException, HttpStatus } from '@nestjs/common';

export const handleError = (error) => {
  if (error instanceof HttpException) throw error;
  throw new HttpException(
    {
      status: 'error',
      message: `${error.message}`,
      data: [],
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};

export const CommonHelper = {
  handleError,
};
