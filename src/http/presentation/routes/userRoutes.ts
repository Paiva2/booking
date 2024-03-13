import { Express, Request, Response } from 'express';
import { authUserDTO, registerUserDTO } from '../dto-schemas';
import { UserFactory } from '../factories/user-factory';
import { zodDto } from '../middlewares';

export function userRoutes(app: Express) {
  const userFactory = new UserFactory();

  app.post(
    '/api/v1/user/register',
    [zodDto(registerUserDTO)],
    async (req: Request, res: Response) => {
      const { registerUserController } = await userFactory.handle();

      const controllerResponse = await registerUserController.handle(req);

      return res.status(controllerResponse.status).send({ reply: controllerResponse.data });
    },
  );

  app.post(
    '/api/v1/user/login',
    [zodDto(authUserDTO)],
    async (req: Request, res: Response) => {
      const { registerUserController } = await userFactory.handle();

      const controllerResponse = await registerUserController.handle(req);

      return res.status(controllerResponse.status).send({ reply: controllerResponse.data });
    },
  );
}
