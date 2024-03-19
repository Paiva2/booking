import { EstablishmentRepository } from '../../../../data/repositories';
import type { EstablishmentEntity } from '../../../entities';
import { Service } from '../../../protocols';

interface ListEstablishmentServiceRequest {
  page: number,
  perPage: number,
  name: string,
  state: string,
  city: string,
}

export class ListEstablishmentService implements Service {
  public constructor(
    private readonly establishmentRepository: EstablishmentRepository,
  ) {}

  public async exec(dto: { query: ListEstablishmentServiceRequest }): Promise<{
    page: number;
    perPage: number;
    list: EstablishmentEntity[];
  }> {
    const { query } = dto;

    let page = Number(query.page);
    let perPage = Number(query.perPage);

    if (page < 1) {
      page = 1;
    }

    if (perPage > 100) {
      perPage = 100;
    }

    if (perPage < 5) {
      perPage = 5;
    }

    const queryParams = {
      ...query,
      page,
      perPage,
    };

    const list = await this.establishmentRepository.find(queryParams);

    return list;
  }
}
