import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default function tokenVerify(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) return res.status(403).send({ status: 403, message: 'Invalid token.' });

  try {
    jwt.verify(
      req.headers.authorization.replaceAll('Bearer ', ''),
      process.env.TOKEN_SECRET!,
      {
        issuer: process.env.TOKEN_ISSUEER,
      },
    );
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
      return res.status(403).send({ status: 403, message: e.message });
    }
  }

  next();
}
