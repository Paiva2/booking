import { EstablishmentAttatchmentEntity, EstablishmentEntity } from '../../domain/entities';
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
      establishment: this.establishmentBuilder(find.establishment),
    };
  }

  public async findByEstablishmentId(id: string): Promise<EstablishmentAttatchmentEntity | null> {
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
      establishment: this.establishmentBuilder(find.establishment),
    };
  }

  private establishmentBuilder(establishment: EstablishmentEntity) {
    return {
      id: establishment.id,
      ownerId: establishment.ownerId,
      name: establishment.name,
      city: establishment.city,
      complement: establishment.complement,
      country: establishment.country,
      description: establishment.description,
      contact: establishment.contact,
      neighbourhood: establishment.neighbourhood,
      number: establishment.number,
      state: establishment.state,
      street: establishment.street,
      type: establishment.type,
      zipcode: establishment.zipcode,
    };
  }
}
