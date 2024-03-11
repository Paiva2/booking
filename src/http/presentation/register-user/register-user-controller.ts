import { Service } from '../../domain/protocols/service';
import { MissingParamException } from '../exceptions';
import { Controller, HttpRequest, HttpResponse } from '../protocols';

export class RegisterUserController implements Controller {
  public constructor(private readonly registerUserService: Service) {}

  public async handle(req: HttpRequest):Promise<HttpResponse> {
    this.dtoCheck(req);

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
