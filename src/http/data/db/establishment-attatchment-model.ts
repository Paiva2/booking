import { EstablishmentAttatchmentEntity } from '../../domain/entities';
import prisma from '../lib/prisma';
import { EstablishmentAttatchmentRepository } from '../repositories';

export class EstablishmentAttatchmentModel implements EstablishmentAttatchmentRepository {
  public async findById(id: string): Promise<EstablishmentAttatchmentEntity | null> {
    const find = await prisma.establishmentAttatchment.findUnique({
      where: {
        id,
      },
      include: {
        establishment: {
          select: {
            id: true,
            ownerId: true,
            name: true,
            contact: true,
            city: true,
            complement: true,
            country: true,
            description: true,
            neighbourhood: true,
            number: true,
            state: true,
            street: true,
            type: true,
            zipcode: true,
          },
        },
      },
    }) as EstablishmentAttatchmentEntity;

    if (!find || !find.establishment) return null;

    return {
      ...find,
      establishment: {
        id: find.establishment.id,
        ownerId: find.establishment.ownerId,
        name: find.establishment.name,
        city: find.establishment.city,
        complement: find.establishment.complement,
        country: find.establishment.country,
        description: find.establishment.description,
        neighbourhood: find.establishment.neighbourhood,
        number: find.establishment.number,
        state: find.establishment.state,
        street: find.establishment.street,
        type: find.establishment.type,
        zipcode: find.establishment.zipcode,
      },
    };
  }
}
