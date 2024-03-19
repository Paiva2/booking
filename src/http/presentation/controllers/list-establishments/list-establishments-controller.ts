import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class ListEstablishmentController implements Controller {
  public constructor(private readonly listEstablishmentService: Service) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    this.dtoCheck(req.query);

    const listEstablishments = await this.listEstablishmentService.exec({
      ...req.query,
      page: Number(req.query.page),
      perPage: Number(req.query.perPage),
    });

    return {
      status: 200,
      data: listEstablishments,
    };
  }

  dtoCheck(data: {
    page: string,
    perPage: string,
    name?: string,
    city?: string,
    state?: string
  }): void {
    if (!data.page) {
      throw new MissingParamException('page');
    }

    if (!data.perPage) {
      throw new MissingParamException('perPage');
    }
  }
}
