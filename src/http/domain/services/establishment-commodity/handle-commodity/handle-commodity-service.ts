import { CommodityRepository, EstablishmentRepository } from '../../../../data/repositories';
import { AlreadyExistsException, ForbiddenException, NotFoundException } from '../../../../presentation/exceptions';
import { CommodityEntity, CreateCommodityEntity, UpdateCommodityEntity } from '../../../entities';
import { Service } from '../../../protocols';

interface HandleCommodityServiceRequest {
  establishmentId: string
  userId: string
  toDelete: string[]
  toCreate: CreateCommodityEntity[]
  toUpdate: UpdateCommodityEntity[]
}

interface HandleCommodityServiceResponse {
  inserted: CommodityEntity[] | null
  deleted: CommodityEntity[] | null
  updated: CommodityEntity[] | null
}

export class HandleCommodityService implements Service {
  public constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly commodityRepository: CommodityRepository,
  ) {}

  public async exec(dto: HandleCommodityServiceRequest): Promise<HandleCommodityServiceResponse> {
    const doesEstablishmentExists = await this.establishmentRepository.findById(
      dto.establishmentId,
    );

    if (!doesEstablishmentExists) {
      throw new NotFoundException('Establishment');
    }

    const doesUserOwnsEstablishment = doesEstablishmentExists.ownerId === dto.userId;

    if (!doesUserOwnsEstablishment) {
      throw new ForbiddenException('Only the establishment owner can perform this action');
    }

    if (!doesEstablishmentExists.establishmentAttatchment) {
      throw new NotFoundException('Establishment attatchment');
    }

    const attatchmentId = doesEstablishmentExists.establishmentAttatchment.id;

    if (dto.toUpdate.length > 0) {
      const newNames = dto.toUpdate.map((icon) => icon.name);

      const doesSomeNewIconNameAlreadyExistsOnEstablishment = await this.commodityRepository
        .findByNames({ attatchmentId, names: newNames });

      if (doesSomeNewIconNameAlreadyExistsOnEstablishment) {
        throw new AlreadyExistsException(`Icon name: ${doesSomeNewIconNameAlreadyExistsOnEstablishment.name}`);
      }
    }

    const handleActions = await this.commodityRepository.handleMultipleActions({
      attatchmentId,
      toCreate: dto.toCreate,
      toDelete: dto.toDelete,
      toUpdate: dto.toUpdate,
    });

    return handleActions;
  }
}
