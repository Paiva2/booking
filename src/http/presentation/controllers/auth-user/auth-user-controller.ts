import {
  Controller,
  HttpRequest,
  HttpResponse,
  JwtHandler,
} from '../../protocols';
import { AuthUserService } from '../../../domain/services/user';
import { MissingParamException } from '../../exceptions';

export class AuthUserController implements Controller {
  public constructor(
    private readonly authUserService: AuthUserService,
    private readonly jwtHandler: JwtHandler,
  ) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    this.dtoCheck(req);

    const { email, password } = req.body;

    const userCreated = await this.authUserService.exec({
      email,
      password,
    });

    const authToken = this.jwtHandler.sign(userCreated.id);

    return {
      status: 200,
      data: authToken,
    };
  }

  dtoCheck(data: Pick<HttpRequest, 'body'>): void {
    if (!data.body.email) {
      throw new MissingParamException('email');
    }

    if (!data.body.password) {
      throw new MissingParamException('password');
    }
  }
}
