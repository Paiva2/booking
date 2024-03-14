import { Request, Response, Express } from 'express';
import {
  authUserDTO, forgotUserPasswordDTO, registerUserDTO, updateUserDTO,
} from '../dto-schemas';
import { UserFactory } from '../factories/user-factory';
import { zodDto } from '../middlewares';
import tokenVerify from '../middlewares/token-verify';

const userFactory = new UserFactory();

const prefix = '/api/v1/user';

export default function userRoutes(app: Express) {
  app.post(
    `${prefix}/register`,
    [zodDto(registerUserDTO)],
    async (req: Request, res: Response) => {
      const { registerUserController } = await userFactory.handle();

      const controllerResponse = await registerUserController.handle(req);

      return res.status(controllerResponse.status).send({ reply: controllerResponse.data });
    },
  );

  app.post(
    `${prefix}/login`,
    [zodDto(authUserDTO)],
    async (req: Request, res: Response) => {
      const { authUserController } = await userFactory.handle();

      const controllerResponse = await authUserController.handle(req);

      return res.status(controllerResponse.status).send({ reply: controllerResponse.data });
    },
  );

  app.get(
    `${prefix}/profile`,
    [tokenVerify],
    async (req: Request, res: Response) => {
      const { getUserProfileController } = await userFactory.handle();

      const controllerResponse = await getUserProfileController.handle(req.headers);

      return res.status(controllerResponse.status).send({ reply: controllerResponse });
    },
  );

  app.patch(
    `${prefix}/profile`,
    [tokenVerify, zodDto(updateUserDTO)],
    async (req: Request, res: Response) => {
      const { updateUserProfileController } = await userFactory.handle();

      const controllerResponse = await updateUserProfileController.handle({
        authorization: req.headers.authorization,
        body: req.body,
      });

      return res.status(controllerResponse.status).send({ reply: controllerResponse.data });
    },
  );

  app.post(
    `${prefix}/forgot-password`,
    [zodDto(forgotUserPasswordDTO)],
    async (req: Request, res: Response) => {
      const { forgotUserPasswordController } = await userFactory.handle();

      const controllerResponse = await forgotUserPasswordController.handle(req);

      return res.status(controllerResponse.status).send();
    },
  );
}
