import { EstablishmentAttatchmentRepository, EstablishmentRepository } from '../../../../data/repositories';
import { EstablishmentImagesRepository } from '../../../../data/repositories/establishment-images-repository';
import { ForbiddenException, MissingParamException, NotFoundException } from '../../../../presentation/exceptions';
import { EstablishmentImageEntity } from '../../../entities';
import { Service } from '../../../protocols';

export class CreateOrDeleteEstablishmentImagesService implements Service {
  public constructor(
    private readonly establishmentAttatchmentRepository: EstablishmentAttatchmentRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly establishmentImagesRepository: EstablishmentImagesRepository,
  ) {}

  public async exec(dto: {
    userId: string
    establishmentId: string
    toInsert: string[]
    toDelete: string[]
  }): Promise<{
      inserted: EstablishmentImageEntity[] | null
      deleted: EstablishmentImageEntity[] | null
    }> {
    if (!dto.toDelete.length && !dto.toInsert.length) {
      throw new MissingParamException('toDelete or toInsert');
    }

    const doesEstablishmentExists = await this.establishmentRepository.findById(
      dto.establishmentId,
    );

    if (!doesEstablishmentExists) {
      throw new NotFoundException('Establishment');
    }

    if (doesEstablishmentExists.ownerId !== dto.userId) {
      throw new ForbiddenException('Provided userId dont owns this establishment');
    }

    const doesAttatchmentExists = await this.establishmentAttatchmentRepository
      .findByEstablishmentId(doesEstablishmentExists.id);

    if (!doesAttatchmentExists) {
      throw new NotFoundException('Establishment attatchment');
    }

    const imagesHandled = await this.establishmentImagesRepository.createOrDelete({
      toDelete: dto.toDelete,
      toInsert: dto.toInsert,
    });

    return imagesHandled;
  }
}
