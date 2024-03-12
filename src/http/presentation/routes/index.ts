import { Express } from 'express';
import { userRoutes } from './userRoutes';

export function routesHandler(app: Express) {
  userRoutes(app);
}
