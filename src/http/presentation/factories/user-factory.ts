import { UserModel } from '../../data/db';
import { AuthUserService, RegisterUserService, UpdateUserService } from '../../domain/services/user';
import { EncrypterAdapter } from '../../domain/utils';
import { AuthUserController } from '../controllers/auth-user/auth-user-controller';
import { GetUserProfileController } from '../controllers/get-user-profile/get-user-profile-controller';
import { RegisterUserController } from '../controllers/register-user/register-user-controller';
import { UpdateUserProfileController } from '../controllers/update-user-profile/update-user-profile-controller';
import { JwtHandlerAdapter } from '../utils/jwt-adapter';

export class UserFactory {
  public async handle() {
    const services = await this.services();
    const jwtAdapter = new JwtHandlerAdapter();
    const models = this.models();

    const registerUserController = new RegisterUserController(services.newRegisterUserService);
    const authUserController = new AuthUserController(services.authUserService, jwtAdapter);
    const getUserProfileController = new GetUserProfileController(models.userModel, jwtAdapter);

    const updateUserProfileController = new UpdateUserProfileController(
      services.updateUserService,
      jwtAdapter,
    );

    return {
      registerUserController,
      authUserController,
      getUserProfileController,
      updateUserProfileController,
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
    const updateUserService = new UpdateUserService(models.userModel, protocols.encrypterAdapter);

    return {
      newRegisterUserService,
      authUserService,
      updateUserService,
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
