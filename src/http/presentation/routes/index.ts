import { Express } from 'express';
import userRoutes from './userRoutes';
import establishmentRoutes from './establishmentRoutes';
import { bookDateRoutes } from './bookDateRoutes';

export function routesHandler(app: Express) {
  userRoutes(app);
  establishmentRoutes(app);
  bookDateRoutes(app);
}
