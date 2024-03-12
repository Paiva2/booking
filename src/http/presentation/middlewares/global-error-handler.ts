import { NextFunction, Request, Response } from 'express';
import { GlobalException } from '../exceptions/global-exception';

export function globalErrorHandler(
  error: GlobalException,
  _: Request,
  res:Response,
  next: NextFunction,
) {
  if (error instanceof GlobalException) {
    const status = error.status ? error.status : 500;

    return res.status(status).send({
      message: error.message ?? 'Internal server error.',
      statusCode: status,
    });
  }

  return next();
}
