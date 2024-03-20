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

  public async exec(dto: ListEstablishmentServiceRequest): Promise<{
    page: number;
    perPage: number;
    list: EstablishmentEntity[];
  }> {
    const { page, perPage } = dto;

    let queryPage = Number(page);
    let queryPerPage = Number(perPage);

    if (page < 1) {
      queryPage = 1;
    }

    if (perPage > 100) {
      queryPerPage = 100;
    }

    if (perPage < 5) {
      queryPerPage = 5;
    }

    const queryParams = {
      ...dto,
      page: queryPage,
      perPage: queryPerPage,
    };

    const list = await this.establishmentRepository.find(queryParams);

    return list;
  }
}
