import { Express } from 'express';
import userRoutes from './userRoutes';
import establishmentRoutes from './establishmentRoutes';
import bookDateRoutes from './bookDateRoutes';
import genericRoutes from './genericRoutes';

export function routesHandler(app: Express) {
  userRoutes(app);
  establishmentRoutes(app);
  bookDateRoutes(app);
  genericRoutes(app);
}
