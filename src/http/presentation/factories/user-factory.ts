import { UserModel } from '../../data/db';
import { RegisterUserService } from '../../domain/services/user';
import { EncrypterAdapter } from '../../domain/utils';
import { RegisterUserController } from '../controllers/register-user/register-user-controller';

export class UserFactory {
  public async handle() {
    const services = await this.services();

    const registerUserController = new RegisterUserController(services.newRegisterUserService);

    return {
      registerUserController,
    };
  }

  private async services() {
    const models = this.models();
    const protocols = this.domainProtocols();

    const newRegisterUserService = new RegisterUserService(
      models.userModel,
      protocols.encrypterAdapter,
    );

    return {
      newRegisterUserService,
    };
  }

  private models() {
    const userModel = new UserModel();

    return {
      userModel,
    };
  }

  private domainProtocols() {
    const encrypterAdapter = new EncrypterAdapter();

    return {
      encrypterAdapter,
    };
  }
}
