import { MissingParamException } from '../../exceptions/missing-param-exception';
import { Controller, HttpRequest } from '../protocols';

export class RegisterUserController implements Controller {
  public async handle(req: HttpRequest) {
    this.dtoCheck(req);

    const {
      name, email, password, contact, address,
    } = req.body;

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
