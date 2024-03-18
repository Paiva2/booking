import { UserModel } from '../../data/db';
import { EstablishmentModel } from '../../data/db/establishment-model';
import { RegisterEstablishmentService } from '../../domain/services/establishment';
import { RegisterEstablishmentController } from '../controllers/register-establishment/register-establishment-controller';
import { JwtHandlerAdapter } from '../utils/jwt-adapter';

export class EstablishmentFactory {
  public async handle() {
    const { jwtHandler } = this.presentationProtocols();
    const { registerEstablishmentService } = await this.services();

    const registerEstablishmentController = new RegisterEstablishmentController(
      registerEstablishmentService,
      jwtHandler,
    );

    return {
      registerEstablishmentController,
    };
  }

  private async services() {
    const models = this.models();

    const registerEstablishmentService = new RegisterEstablishmentService(
      models.userModel,
      models.establishmentModel,
    );

    return {
      registerEstablishmentService,
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
