import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  JwtHandler,
} from '../../protocols';

export class ListBookedDatesController implements Controller {
  public constructor(
    private readonly jwtHandler: JwtHandler,
    private readonly listBookedDatesService: Service,
  ) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    const parseId = this.jwtHandler.decode(req.headers?.authorization?.replaceAll('Bearer ', ''));

    this.dtoCheck({
      page: req.query.page,
      perPage: req.query.perPage,
      parseId,
    });

    const { page, perPage } = req.query;

    const serviceResponse = await this.listBookedDatesService.exec({
      userId: parseId,
      page,
      perPage,
    });

    return {
      status: 200,
      data: serviceResponse,
    };
  }

  dtoCheck(data: { page: string, perPage: string, parseId: string }): void {
    if (!data.page) {
      throw new MissingParamException('page');
    }

    if (!data.perPage) {
      throw new MissingParamException('perPage');
    }

    if (!data.parseId) {
      throw new MissingParamException('parseId');
    }
  }
}
