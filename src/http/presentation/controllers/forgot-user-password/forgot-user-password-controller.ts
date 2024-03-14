import { ForgotUserPasswordService } from '../../../domain/services/user';
import { MissingParamException } from '../../exceptions';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class ForgotUserPasswordController implements Controller {
  public constructor(private readonly forgotUserPasswordService: ForgotUserPasswordService) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    this.dtoCheck(req.body);

    const { email } = req.body;

    await this.forgotUserPasswordService.exec(email);

    return {
      status: 200,
      data: 'A new password was sent to your e-mail.',
    };
  }

  dtoCheck(data: { email: string }): void {
    if (!data.email) {
      throw new MissingParamException('email');
    }
  }
}
