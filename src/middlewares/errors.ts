import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/root';

export function errorMiddleware(
  error: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  res.status(error.statusCode).send({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors,
  });
}
