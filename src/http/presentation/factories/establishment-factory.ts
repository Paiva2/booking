import { UserModel } from '../../data/db';
import { EstablishmentModel } from '../../data/db/establishment-model';
import { ListEstablishmentService, RegisterEstablishmentService } from '../../domain/services/establishment';
import { ListEstablishmentController } from '../controllers/list-establishments/list-establishments-controller';
import { RegisterEstablishmentController } from '../controllers/register-establishment/register-establishment-controller';
import { JwtHandlerAdapter } from '../utils/jwt-adapter';

export class EstablishmentFactory {
  public async handle() {
    const { jwtHandler } = this.presentationProtocols();
    const { registerEstablishmentService, listEstablishmentService } = await this.services();

    const registerEstablishmentController = new RegisterEstablishmentController(
      registerEstablishmentService,
      jwtHandler,
    );

    const listEstablishmentController = new ListEstablishmentController(listEstablishmentService);

    return {
      registerEstablishmentController,
      listEstablishmentController,
    };
  }

  private async services() {
    const { establishmentModel, userModel } = this.models();

    const registerEstablishmentService = new RegisterEstablishmentService(
      userModel,
      establishmentModel,
    );

    const listEstablishmentService = new ListEstablishmentService(establishmentModel);

    return {
      registerEstablishmentService,
      listEstablishmentService,
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
