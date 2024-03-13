import { UserModel } from '../../data/db';
import { AuthUserService, RegisterUserService } from '../../domain/services/user';
import { EncrypterAdapter } from '../../domain/utils';
import { AuthUserController } from '../controllers/auth-user/auth-user-controller';
import { RegisterUserController } from '../controllers/register-user/register-user-controller';
import { JwtHandlerAdapter } from '../utils/jwt-adapter';

export class UserFactory {
  public async handle() {
    const services = await this.services();
    const jwtAdapter = new JwtHandlerAdapter();

    const registerUserController = new RegisterUserController(services.newRegisterUserService);
    const authUserController = new AuthUserController(services.authUserService, jwtAdapter);

    return {
      registerUserController,
      authUserController,
    };
  }

  private async services() {
    const models = this.models();
    const protocols = this.domainProtocols();

    const newRegisterUserService = new RegisterUserService(
      models.userModel,
      protocols.encrypterAdapter,
    );

    const authUserService = new AuthUserService(models.userModel, protocols.encrypterAdapter);

    return {
      newRegisterUserService,
      authUserService,
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
