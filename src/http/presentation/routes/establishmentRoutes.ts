import { Request, Response, Express } from 'express';
import { EstablishmentFactory } from '../factories/establishment-factory';
import { registerEstablishmentDTO } from '../dto-schemas';
import { zodDto } from '../middlewares';
import tokenVerify from '../middlewares/token-verify';

const establishmentFactory = new EstablishmentFactory();

const prefix = '/api/v1/establishment';

export default function establishmentRoutes(app: Express) {
  app.post(
    `${prefix}/register`,
    [tokenVerify, zodDto(registerEstablishmentDTO)],
    async (req: Request, res: Response) => {
      const { registerEstablishmentController } = await establishmentFactory.handle();

      const controllerResponse = await registerEstablishmentController.handle(req);

      return res.status(controllerResponse.status).send({ reply: controllerResponse.data });
    },
  );

  app.get(
    `${prefix}/list`,
    async (req: Request, res: Response) => {
      const { listEstablishmentController } = await establishmentFactory.handle();

      const controllerResponse = await listEstablishmentController.handle(req);

      return res.status(controllerResponse.status).send({ reply: controllerResponse.data });
    },
  );
}
