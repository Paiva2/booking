import prisma from '../lib/prisma';
import { RegisterEstablishmentEntity, EstablishmentEntity } from '../../domain/entities';
import { EstablishmentRepository } from '../repositories';

export class EstablishmentModel implements EstablishmentRepository {
  public async save({ establishment, userId }: {
    userId: string,
    establishment: RegisterEstablishmentEntity }): Promise<EstablishmentEntity> {
    let createEstablishment = {} as EstablishmentEntity;

    try {
      await prisma.$executeRawUnsafe('BEGIN TRANSACTION');

      createEstablishment = await prisma.establishment.create({
        data: {
          ownerId: userId,
          city: establishment.city,
          contact: establishment.contact,
          country: establishment.country,
          description: establishment.description,
          name: establishment.name,
          neighbourhood: establishment.neighbourhood,
          number: establishment.number,
          state: establishment.state,
          street: establishment.street,
          type: establishment.type,
          zipcode: establishment.zipcode,
          complement: establishment.complement,
        },
        include: {
          establishmentAttatchment: true,
        },
      }) as EstablishmentEntity;

      if (establishment.images.length) {
        const images = establishment.images.map((image) => ({
          url: image,
          establishmentAttatchmentId: createEstablishment?.establishmentAttatchmentId as string,
        }));

        await prisma.establishmentImage.createMany({
          data: images,
        });
      }

      if (establishment.commodities.length) {
        const commodities = establishment.commodities.map((commodity) => ({
          name: commodity.name,
          commodityIconUrl: commodity.iconUrl,
          establishmentAttatchmentId: createEstablishment?.establishmentAttatchmentId as string,
        }));

        await prisma.commodity.createMany({
          data: commodities,
        });
      }

      await prisma.$executeRawUnsafe('COMMIT TRANSACTION');
    } catch (e) {
      console.log(e);
      await prisma.$executeRawUnsafe('ROLLBACK TRANSACTION');
    }

    return createEstablishment;
  }

  public async findByName({ name, userId }: {
    userId: string,
    name: string }): Promise<EstablishmentEntity | null> {
    const find = await prisma.establishment.findFirst({
      where: {
        ownerId: userId,
        AND: {
          name,
        },
      },
    }) as EstablishmentEntity | null;

    return find;
  }
}
