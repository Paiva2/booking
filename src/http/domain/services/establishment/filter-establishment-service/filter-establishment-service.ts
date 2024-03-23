import { EstablishmentRepository } from '../../../../data/repositories';
import { NotFoundException } from '../../../../presentation/exceptions';
import { EstablishmentEntity } from '../../../entities';
import { Service } from '../../../protocols';

export class FilterEstablishmentService implements Service {
  public constructor(private readonly establishmentRepository: EstablishmentRepository) {}

  public async exec(dto: { establishmentId: string }): Promise<EstablishmentEntity> {
    const getEstablishment = await this.establishmentRepository.findById(dto.establishmentId);

    if (!getEstablishment) {
      throw new NotFoundException('Establishment');
    }

    return getEstablishment;
  }
}
