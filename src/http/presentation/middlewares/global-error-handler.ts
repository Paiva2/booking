import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
import { GlobalException } from '../exceptions/global-exception';

export function globalErrorHandler(
  error: GlobalException | Error,
  _: Request,
  res:Response,
  next: NextFunction,
) {
  if (error instanceof multer.MulterError) {
    return res.status(400).send(`Error uploading file: ${error.message}`);
  }

  if (error instanceof GlobalException) {
    const status = error.status ? error.status : 500;

    return res.status(status).send({
      message: error.message ?? 'Internal server error.',
      statusCode: status,
    });
  }

  if (error instanceof Error) {
    return res.status(500).send({
      message: error.message ?? 'Internal server error.',
      statusCode: 500,
    });
  }

  return next();
}
