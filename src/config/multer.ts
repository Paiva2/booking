import multer from 'multer';
import { Request } from 'express';

export const storage = multer.memoryStorage();

export const fileFilter = (_: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};
