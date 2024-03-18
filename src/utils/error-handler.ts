// import { Request, Response, NextFunction } from 'express';
// import { ErrorCode, HttpException } from '../exceptions/root';
// import { InternalException } from '../exceptions/internal-exception';

// export const errorHandler = (method: Function) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       method(req, res, next);
//     } catch (error) {
//       let exception: HttpException;
//       if (error instanceof HttpException) {
//         exception = error;
//       } else {
//         exception = new InternalException(
//           'Internal Server Error',
//           ErrorCode.INTERNAL_SERVER_ERROR
//         );
//       }
//       next(exception);
//     }
//   };
// };
