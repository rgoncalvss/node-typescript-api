export class HttpException extends Error {
  message: string;
  errorCode: any;
  statusCode: number;
  errors: any;

  constructor(message: string, errorCode: any, statusCode: number, error: any) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = error;
  }
}

export enum ErrorCode {
  BAD_REQUEST = '400',
  UNAUTHORIZED = '401',
  FORBIDDEN = '403',
  NOT_FOUND = '404',
  INTERNAL_SERVER_ERROR = '500',
  CONFLICT = '409',
}
