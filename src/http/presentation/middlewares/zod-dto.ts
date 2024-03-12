import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export function zodDto(zodObject: AnyZodObject) {
  return (req: Request, res:Response, next: NextFunction) => {
    try {
      zodObject.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrorValidation = fromZodError(error);

        const mapErrors = zodErrorValidation.details.map((err) => err.message);

        return res.status(400).send({
          statusCode: 400,
          type: 'Invalid DTO',
          errors: mapErrors,
        });
      }
    }

    return next();
  };
}
