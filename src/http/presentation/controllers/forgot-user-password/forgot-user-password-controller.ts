import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class ForgotUserPasswordController implements Controller {
  public constructor(private readonly forgotUserPasswordService: Service) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    this.dtoCheck(req.body);

    const { email } = req.body;

    await this.forgotUserPasswordService.exec(email);

    return {
      status: 204,
      data: null,
    };
  }

  dtoCheck(data: { email: string }): void {
    if (!data.email) {
      throw new MissingParamException('email');
    }
  }
}
