import { EstablishmentModel, UserModel } from '../../data/db';
import { FilterEstablishmentService, ListEstablishmentService, RegisterEstablishmentService } from '../../domain/services/establishment';
import { ListOwnEstablishmentsService } from '../../domain/services/establishment/list-own-establishments-service/list-own-establishments-service';
import { FilterEstablishmentController } from '../controllers/filter-establishment/filter-establishment-controller';
import { ListEstablishmentController } from '../controllers/list-establishments/list-establishments-controller';
import { ListOwnEstablishmentsController } from '../controllers/list-own-establishments/list-own-establishments-controller';
import { RegisterEstablishmentController } from '../controllers/register-establishment/register-establishment-controller';
import { JwtHandlerAdapter } from '../utils/jwt-adapter';

export class EstablishmentFactory {
  public async handle() {
    const { jwtHandler } = this.presentationProtocols();
    const {
      registerEstablishmentService,
      listEstablishmentService,
      filterEstablishmentService,
      listOwnEstablishmentsService,
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

    return {
      registerEstablishmentController,
      listEstablishmentController,
      filterEstablishmentController,
      listOwnEstablishmentsController,
    };
  }

  private async services() {
    const { establishmentModel, userModel } = this.models();

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

    return {
      registerEstablishmentService,
      listEstablishmentService,
      filterEstablishmentService,
      listOwnEstablishmentsService,
    };
  }

  private models() {
    const userModel = new UserModel();
    const establishmentModel = new EstablishmentModel();

    return {
      userModel,
      establishmentModel,
    };
  }

  private presentationProtocols() {
    const jwtHandler = new JwtHandlerAdapter();

    return {
      jwtHandler,
    };
  }
}
