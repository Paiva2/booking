import { Request, Response, Express } from 'express';
import { EstablishmentFactory } from '../factories/establishment-factory';
import { registerEstablishmentDTO } from '../dto-schemas';
import { zodDto } from '../middlewares';
import tokenVerify from '../middlewares/token-verify';
import { upload } from '../../../app';
import { s3 } from '../../../config/aws';

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

  app.get(
    `${prefix}/:establishmentId`,
    async (req: Request, res: Response) => {
      const { filterEstablishmentController } = await establishmentFactory.handle();

      const controllerResponse = await filterEstablishmentController.handle(req);

      return res.status(controllerResponse.status).send({ reply: controllerResponse.data });
    },
  );

  app.get(
    `${prefix}/list/own`,
    [tokenVerify],
    async (req: Request, res: Response) => {
      const { listOwnEstablishmentsController } = await establishmentFactory.handle();

      const controllerResponse = await listOwnEstablishmentsController.handle(req);

      return res.status(controllerResponse.status).send({ reply: controllerResponse.data });
    },
  );

  // TODO: MOVE TO CONTROLLER AND MAKE VARIATIONS FOR: PROFILE PIC, ESTABLISHMENT IMAGES AND COMMODITIES ICONS
  app.post(
    `${prefix}/images`,
    [upload.array('images', 15)],
    async (req: Request, res: Response) => {
      if (!req.files) return res.status(400).send({ message: "Files can't be empty." });

      const iconMapper = JSON.parse(req.body.iconMapper)
        .map((icon: { idx: string, name: string }) => ({
          idx: Number(icon.idx),
          name: icon.name,
        }));

      const files = req.files as Express.Multer.File[];

      const bucketName = process.env.AWS_S3_ESTABLISHMENTS_BUCKET_NAME as string;

      const urls = [];

      for await (const [idx, file] of files.entries()) {
        const findIcon = iconMapper.find((icon: { idx: number, name: string }) => icon.idx === idx);

        const awsParams = {
          Bucket: bucketName,
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        try {
          const uploadResponse = await s3.upload(awsParams).promise();

          if (findIcon) {
            const iconName = findIcon.name;

            urls.push({
              name: iconName,
              iconUrl: uploadResponse,
            });
          }
        } catch (error) {
          console.error(error);
          res.status(500).send(`Error uploading file ${file.filename}.`);
        }
      }

      return res.status(200).send({ images: urls });
    },
  );
}
