import { Express } from 'express';
import userRoutes from './userRoutes';
import establishmentRoutes from './establishmentRoutes';

export function routesHandler(app: Express) {
  userRoutes(app);
  establishmentRoutes(app);
}
