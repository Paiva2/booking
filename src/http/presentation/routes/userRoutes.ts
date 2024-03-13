import { Request, Response, Express } from 'express';
import { authUserDTO, registerUserDTO } from '../dto-schemas';
import { UserFactory } from '../factories/user-factory';
import { zodDto } from '../middlewares';

const userFactory = new UserFactory();

export default function userRoutes(app: Express) {
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
      const { authUserController } = await userFactory.handle();

      const controllerResponse = await authUserController.handle(req);

      return res.status(controllerResponse.status).send({ reply: controllerResponse.data });
    },
  );
}
