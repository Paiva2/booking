import { UserModel } from '../../data/db';
import { EstablishmentModel } from '../../data/db/establishment-model';
import { RegisterEstablishmentService } from '../../domain/services/establishment';
import { RegisterEstablishmentController } from '../controllers/register-establishment/register-establishment-controller';

export class EstablishmentFactory {
  public async handle() {
    const { registerEstablishmentService } = await this.services();

    const registerEstablishmentController = new RegisterEstablishmentController(
      registerEstablishmentService,
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
}
