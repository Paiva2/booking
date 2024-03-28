import { EstablishmentAttatchmentModel, EstablishmentModel, UserModel } from '../../data/db';
import { EstablishmentImagesModel } from '../../data/db/establishment-images-model';
import {
  FilterEstablishmentService,
  ListEstablishmentService,
  RegisterEstablishmentService,
  UpdateEstablishmentService,
} from '../../domain/services/establishment';
import { CreateOrDeleteEstablishmentImagesService } from '../../domain/services/establishment-images';
import { ListOwnEstablishmentsService } from '../../domain/services/establishment/list-own-establishments-service/list-own-establishments-service';
import { CreateOrDeleteEstablishmentImagesController } from '../controllers/create-or-delete-establishment-images/create-or-delete-establishment-images-controller';
import { FilterEstablishmentController } from '../controllers/filter-establishment/filter-establishment-controller';
import { ListEstablishmentController } from '../controllers/list-establishments/list-establishments-controller';
import { ListOwnEstablishmentsController } from '../controllers/list-own-establishments/list-own-establishments-controller';
import { RegisterEstablishmentController } from '../controllers/register-establishment/register-establishment-controller';
import { UpdateEstablishmentController } from '../controllers/update-establishment/update-establishment-controller';
import { JwtHandlerAdapter } from '../utils/jwt-adapter';

export class EstablishmentFactory {
  public async handle() {
    const { jwtHandler } = this.presentationProtocols();
    const {
      registerEstablishmentService,
      listEstablishmentService,
      filterEstablishmentService,
      listOwnEstablishmentsService,
      updateEstablishmentService,
      createOrDeleteEstablishmentImageService,
    } = await this.services();

    const registerEstablishmentController = new RegisterEstablishmentController(
      registerEstablishmentService,
      jwtHandler,
    );

    const listEstablishmentController = new ListEstablishmentController(listEstablishmentService);

    const filterEstablishmentController = new FilterEstablishmentController(
      filterEstablishmentService,
    );

    const listOwnEstablishmentsController = new ListOwnEstablishmentsController(
      listOwnEstablishmentsService,
      jwtHandler,
    );

    const updateEstablishmentController = new UpdateEstablishmentController(
      updateEstablishmentService,
      jwtHandler,
    );

    const CreateOrDeleteImages = CreateOrDeleteEstablishmentImagesController; // name was too large

    const createOrDeleteEstablishmentImagesController = new CreateOrDeleteImages(
      createOrDeleteEstablishmentImageService,
      jwtHandler,
    );

    return {
      registerEstablishmentController,
      listEstablishmentController,
      filterEstablishmentController,
      listOwnEstablishmentsController,
      updateEstablishmentController,
      createOrDeleteEstablishmentImagesController,
    };
  }

  private async services() {
    const {
      establishmentModel,
      userModel,
      establishmentAttatchmentModel,
      establishmentImagesModel,
    } = this.models();

    const registerEstablishmentService = new RegisterEstablishmentService(
      userModel,
      establishmentModel,
    );

    const listEstablishmentService = new ListEstablishmentService(establishmentModel);

    const filterEstablishmentService = new FilterEstablishmentService(establishmentModel);

    const listOwnEstablishmentsService = new ListOwnEstablishmentsService(
      userModel,
      establishmentModel,
    );

    const updateEstablishmentService = new UpdateEstablishmentService(
      establishmentModel,
      establishmentAttatchmentModel,
    );

    const createOrDeleteEstablishmentImageService = new CreateOrDeleteEstablishmentImagesService(
      establishmentAttatchmentModel,
      establishmentModel,
      establishmentImagesModel,
    );

    return {
      registerEstablishmentService,
      listEstablishmentService,
      filterEstablishmentService,
      listOwnEstablishmentsService,
      updateEstablishmentService,
      createOrDeleteEstablishmentImageService,
    };
  }

  private models() {
    const userModel = new UserModel();
    const establishmentModel = new EstablishmentModel();
    const establishmentAttatchmentModel = new EstablishmentAttatchmentModel();
    const establishmentImagesModel = new EstablishmentImagesModel();

    return {
      userModel,
      establishmentModel,
      establishmentAttatchmentModel,
      establishmentImagesModel,
    };
  }

  private presentationProtocols() {
    const jwtHandler = new JwtHandlerAdapter();

    return {
      jwtHandler,
    };
  }
}
