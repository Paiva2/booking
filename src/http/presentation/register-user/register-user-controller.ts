import { RegisterUserService } from '../../domain/services/user/register-user-service';
import { MissingParamException } from '../../exceptions/missing-param-exception';
import { Controller, HttpRequest } from '../protocols';

export class RegisterUserController implements Controller {
  public constructor(private readonly registerUserService: RegisterUserService) {}

  public async handle(req: HttpRequest) {
    this.dtoCheck(req);

    const {
      name, email, password, contact, address,
    } = req.body;

    await this.registerUserService.exec(req.body);

    return {
      status: 200,
      data: 'Register sucessfull!',
    };
  }

  dtoCheck(data: Pick<HttpRequest, 'body'>): void {
    if (!data.body.name) {
      throw new MissingParamException('name');
    }

    if (!data.body.email) {
      throw new MissingParamException('email');
    }

    if (!data.body.password) {
      throw new MissingParamException('password');
    }

    if (!data.body.contact) {
      throw new MissingParamException('contact');
    }

    if (!data.body.address) {
      throw new MissingParamException('address');
    }
  }
}
