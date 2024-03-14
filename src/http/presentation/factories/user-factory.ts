import { UserModel } from '../../data/db';
import {
  AuthUserService, ForgotUserPasswordService, RegisterUserService, UpdateUserService,
} from '../../domain/services/user';
import { EmailSenderAdapter, EncrypterAdapter } from '../../domain/utils';
import { AuthUserController } from '../controllers/auth-user/auth-user-controller';
import { ForgotUserPasswordController } from '../controllers/forgot-user-password/forgot-user-password-controller';
import { GetUserProfileController } from '../controllers/get-user-profile/get-user-profile-controller';
import { RegisterUserController } from '../controllers/register-user/register-user-controller';
import { UpdateUserProfileController } from '../controllers/update-user-profile/update-user-profile-controller';
import { JwtHandlerAdapter } from '../utils/jwt-adapter';

export class UserFactory {
  public async handle() {
    const {
      newRegisterUserService,
      authUserService,
      updateUserService,
      forgotUserPasswordService,

    } = await this.services();
    const jwtAdapter = new JwtHandlerAdapter();
    const { userModel } = this.models();

    const registerUserController = new RegisterUserController(newRegisterUserService);

    const authUserController = new AuthUserController(authUserService, jwtAdapter);

    const getUserProfileController = new GetUserProfileController(userModel, jwtAdapter);

    const updateUserProfileController = new UpdateUserProfileController(
      updateUserService,
      jwtAdapter,
    );

    const forgotUserPasswordController = new ForgotUserPasswordController(
      forgotUserPasswordService,
    );

    return {
      registerUserController,
      authUserController,
      getUserProfileController,
      updateUserProfileController,
      forgotUserPasswordController,
    };
  }

  private async services() {
    const models = this.models();
    const domainProtocols = this.domainProtocols();

    const newRegisterUserService = new RegisterUserService(
      models.userModel,
      domainProtocols.encrypterAdapter,
    );

    const authUserService = new AuthUserService(models.userModel, domainProtocols.encrypterAdapter);

    const updateUserService = new UpdateUserService(
      models.userModel,
      domainProtocols.encrypterAdapter,
    );

    const forgotUserPasswordService = new ForgotUserPasswordService(
      domainProtocols.mailSenderAdapter,
      models.userModel,
      domainProtocols.encrypterAdapter,
    );

    return {
      newRegisterUserService,
      authUserService,
      updateUserService,
      forgotUserPasswordService,
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
    const mailSenderAdapter = new EmailSenderAdapter();

    return {
      encrypterAdapter,
      mailSenderAdapter,
    };
  }
}
