import {
  Controller,
  HttpRequest,
  HttpResponse,
  JwtHandler,
} from '../../protocols';
import { UpdateUserService } from '../../../domain/services/user';
import { MissingParamException } from '../../exceptions';

export class UpdateUserProfileController implements Controller {
  public constructor(
    private readonly updateUserService: UpdateUserService,
    private readonly jwtHandler: JwtHandler,
  ) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    this.dtoCheck({ authorization: req.authorization });

    const userId = this.jwtHandler.decode(req.authorization.replaceAll('Bearer ', ''));

    const updatedUser = await this.updateUserService.exec({
      userId,
      ...req.body,
    });

    return {
      status: 200,
      data: updatedUser,
    };
  }

  dtoCheck(data: { authorization:string }): void {
    if (!data.authorization) {
      throw new MissingParamException('auth token');
    }
  }
}
