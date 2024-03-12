import { Express, Request, Response } from 'express';
import { UserFactory } from '../factories/user-factory';

export function userRoutes(app: Express) {
  const userFactory = new UserFactory();

  app.post('/api/v1/user/register', async (req: Request, res: Response) => {
    const { registerUserController } = await userFactory.handle();

    const controllerResponse = await registerUserController.handle(req);

    return res.status(controllerResponse.status).send(controllerResponse.data);
  });
}
