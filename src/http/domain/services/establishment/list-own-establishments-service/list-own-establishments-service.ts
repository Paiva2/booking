import { EstablishmentRepository, UserRepository } from '../../../../data/repositories';
import { MissingParamException, NotFoundException } from '../../../../presentation/exceptions';
import { EstablishmentEntity } from '../../../entities';
import { Service } from '../../../protocols';

export class ListOwnEstablishmentsService implements Service {
  public constructor(
    private readonly userRespository: UserRepository,
    private readonly establishmentRepository: EstablishmentRepository,
  ) {}

  public async exec(dto: {
    userId: string,
    name?: string,
    page: string,
    perPage: string,
    orderBy: 'asc' | 'desc'
  }): Promise<{
      page: number,
      perPage: number,
      list: EstablishmentEntity[]
    }> {
    if (!dto.userId) {
      throw new MissingParamException('userId');
    }

    let page = Number(dto.page);
    let perPage = Number(dto.perPage);
    let { orderBy } = dto;

    if (!page) {
      page = 1;
    } else if (page > 100) {
      page = 100;
    } else if (page < 1) {
      page = 1;
    }

    if (!perPage) {
      perPage = 5;
    } else if (perPage > 100) {
      perPage = 100;
    } else if (perPage < 5) {
      perPage = 5;
    }

    if (!orderBy) {
      orderBy = 'desc';
    }

    const doesUserExists = await this.userRespository.findById(dto.userId);

    if (!doesUserExists) {
      throw new NotFoundException('User');
    }

    const getEstablishments = await this.establishmentRepository.findAllByUserId({
      page,
      perPage,
      userId: dto.userId,
      orderBy,
      name: dto.name,
    });

    return getEstablishments;
  }
}
