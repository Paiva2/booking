import { EstablishmentRepository } from '../../../data/repositories';
import { MissingParamException } from '../../exceptions';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class ListEstablishmentController implements Controller {
  public constructor(private readonly establishmentRepository: EstablishmentRepository) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    this.dtoCheck(req.query);

    const listEstablishments = await this.establishmentRepository.find({
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
