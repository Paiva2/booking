import { BookedDatesRepository, UserRepository } from '../../../../data/repositories';
import { NotFoundException } from '../../../../presentation/exceptions';
import { BookedDateEntity } from '../../../entities';
import { Service } from '../../../protocols';

export class ListBookedDatesService implements Service {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly bookedDateRepository: BookedDatesRepository,
  ) {}

  public async exec(dto: { userId: string, page: string, perPage: string }): Promise<{
    page: number,
    perPage: number,
    list: BookedDateEntity[]
  }> {
    let page = Number(dto.page);
    let perPage = Number(dto.perPage);

    if (page < 1) {
      page = 1;
    }

    if (perPage > 100) {
      perPage = 100;
    }

    if (perPage < 5) {
      perPage = 5;
    }

    const doesUserExists = await this.userRepository.findById(dto.userId);

    if (!doesUserExists) {
      throw new NotFoundException('User');
    }

    const listDates = await this.bookedDateRepository.findAllFromUser({
      page,
      perPage,
      userId: dto.userId,
    });

    return listDates;
  }
}
