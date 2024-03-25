import { EstablishmentEntity } from '../../../domain/entities';
import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  JwtHandler,
} from '../../protocols';

export class ListOwnEstablishmentsController implements Controller {
  public constructor(
    private readonly listOwnEstablishmentsService: Service,
    private readonly jwtHandler: JwtHandler,
  ) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    this.dtoCheck({
      userId: req.headers?.authorization,
    });

    const userId = this.jwtHandler.decode(req.headers?.authorization?.replaceAll('Bearer ', ''));

    const { query } = req;

    const listEstablishments: Promise<{
      page: number,
      perPage: number,
      list: EstablishmentEntity[]
    }> = await this.listOwnEstablishmentsService.exec({
      userId,
      name: query.name,
      page: query.page,
      perPage: query.perPage,
      orderBy: query.orderBy,
    });

    return {
      status: 200,
      data: listEstablishments,
    };
  }

  dtoCheck(data: { userId: string }): void {
    if (!data.userId) {
      throw new MissingParamException('userId');
    }
  }
}
