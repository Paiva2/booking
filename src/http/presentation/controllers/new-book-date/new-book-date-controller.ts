import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';
import {
  Controller, HttpRequest, HttpResponse, JwtHandler,
} from '../../protocols';

export class NewBookDateController implements Controller {
  public constructor(
    private readonly jwtHandler: JwtHandler,
    private readonly newBookDateService: Service,
  ) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    const parseUserId = this.jwtHandler.decode(req.headers.authorization?.replaceAll('Bearer ', ''));

    const requestItens = {
      userId: parseUserId,
      establishmentAttatchmentId: req.params.establishmentAttatchmentId,
    };

    this.dtoCheck(requestItens);

    const newBooking = await this.newBookDateService.exec(requestItens);

    return {
      status: 201,
      data: {
        id: newBooking.id,
        bookedDate: newBooking.bookedDate,
      },
    };
  }

  dtoCheck(data: { userId: string, establishmentAttatchmentId: string }): void {
    if (!data.userId) {
      throw new MissingParamException('userId');
    }

    if (!data.establishmentAttatchmentId) {
      throw new MissingParamException('establishmentAttatchmentId');
    }
  }
}
