import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';
import {
  Controller, HttpRequest, HttpResponse, JwtHandler,
} from '../../protocols';

export class UpdateEstablishmentController implements Controller {
  public constructor(
    private readonly updateEstablishmentService: Service,
    private readonly jwtHandler: JwtHandler,
  ) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    this.dtoCheck({
      authToken: req.headers.authorization,
    });

    const parseUserId = this.jwtHandler.decode(req.headers.authorization.replaceAll('Bearer', ''));

    const updatedEstablishment = await this.updateEstablishmentService.exec({
      ownerId: parseUserId,
      update: req.body,
    });

    return {
      status: 201,
      data: updatedEstablishment,
    };
  }

  dtoCheck(data: { authToken: string }): void {
    if (!data.authToken) {
      throw new MissingParamException('authToken');
    }
  }
}
