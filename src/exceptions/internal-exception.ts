import { ErrorCode, HttpException } from './root';

export class InternalException extends HttpException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 500, null);
  }
}
