import { MissingParamException } from '../exceptions/missing-param-exception';
import { Controller, HttpRequest, HttpResponse } from '../protocols';

export class RegisterUserController implements Controller {
  public async handle(req: HttpRequest, res: HttpResponse) {
    this.dtoCheck(req);
  }

  private dtoCheck(data: Pick<HttpRequest, 'body'>): void {
    if (!data.body.name) {
      throw new MissingParamException('name');
    }

    if (!data.body.email) {
      throw new MissingParamException('email');
    }

    if (!data.body.password) {
      throw new MissingParamException('password');
    }
  }
}
