import { EstablishmentModel, UserModel } from '../../data/db';
import { FilterEstablishmentService, ListEstablishmentService, RegisterEstablishmentService } from '../../domain/services/establishment';
import { FilterEstablishmentController } from '../controllers/filter-establishment/filter-establishment-controller';
import { ListEstablishmentController } from '../controllers/list-establishments/list-establishments-controller';
import { RegisterEstablishmentController } from '../controllers/register-establishment/register-establishment-controller';
import { JwtHandlerAdapter } from '../utils/jwt-adapter';

export class EstablishmentFactory {
  public async handle() {
    const { jwtHandler } = this.presentationProtocols();
    const {
      registerEstablishmentService,
      listEstablishmentService,
      filterEstablishmentService,
    } = await this.services();

    const registerEstablishmentController = new RegisterEstablishmentController(
      registerEstablishmentService,
      jwtHandler,
    );

    const listEstablishmentController = new ListEstablishmentController(listEstablishmentService);

    const filterEstablishmentController = new FilterEstablishmentController(
      filterEstablishmentService,
    );

    return {
      registerEstablishmentController,
      listEstablishmentController,
      filterEstablishmentController,
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

    return {
      registerEstablishmentService,
      listEstablishmentService,
      filterEstablishmentService,
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
