import { HttpException, HttpStatus } from '@nestjs/common';

export const httpExceptionSuccess = (
  message: string,
  status_code: number = HttpStatus.OK,
) => {
  throw new HttpException(
    {
      status: 'success',
      message,
      data: [],
    },
    status_code,
  );
};

export const httpExceptionError = (
  message: string,
  status_code: number = HttpStatus.BAD_REQUEST,
) => {
  throw new HttpException(
    {
      status: 'error',
      message,
      data: [],
    },
    status_code,
  );
};

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

export const incrementTagNumber = async (current: string): Promise<string> => {
  let prefix = current.slice(0, -5);
  let number = parseInt(current.slice(-5));

  if (number < 99999) {
    number++;
  } else {
    const prefixArray = prefix.split('');
    let carry = true;

    for (let i = prefixArray.length - 1; i >= 0 && carry; i--) {
      if (prefixArray[i] === 'Z') {
        prefixArray[i] = 'A';
      } else {
        prefixArray[i] = String.fromCharCode(prefixArray[i].charCodeAt(0) + 1);
        carry = false;
      }
    }

    if (carry) {
      prefixArray.unshift('A');
    }

    prefix = prefixArray.join('');
    number = 1;
  }

  return `${prefix}${number.toString().padStart(5, '0')}`;
};

export const CommonHelper = {
  httpExceptionSuccess,
  httpExceptionError,
  handleError,
  incrementTagNumber,
};
