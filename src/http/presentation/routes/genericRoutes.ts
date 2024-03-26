import { Express, Request, Response } from 'express';
import { upload } from '../../../app';
import { GenericFactory } from '../factories/generic-factory';
import tokenVerify from '../middlewares/token-verify';

const prefix = '/api/v1/generic';

export default function genericRoutes(app: Express) {
  const factory = new GenericFactory();

  app.post(
    `${prefix}/upload`,
    [upload.array('images', 15), tokenVerify],
    async (req: Request, res: Response) => {
      const { uploadImagesController } = await factory.handle();

      const response = await uploadImagesController.handle({
        query: req.query,
        files: req.files,
        body: req.body,
      });

      return res.status(response.status).send(response.data);
    },
  );
}
