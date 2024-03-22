import { EstablishmentAttatchmentEntity } from '../../domain/entities';
import prisma from '../lib/prisma';
import { EstablishmentAttatchmentRepository } from '../repositories';

export class EstablishmentAttatchmentModel implements EstablishmentAttatchmentRepository {
  public async findById(id: string): Promise<EstablishmentAttatchmentEntity | null> {
    const find = await prisma.establishmentAttatchment.findUnique({
      where: {
        id,
      },
    });

    return find;
  }
}
