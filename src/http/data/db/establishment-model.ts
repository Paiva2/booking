import prisma from '../lib/prisma';
import { RegisterEstablishmentEntity, EstablishmentEntity } from '../../domain/entities';
import { EstablishmentRepository } from '../repositories';

interface ImageCreationSchema {
  url:string
}

interface CommodityCreationSchema {
  name: string,
  commodityIconUrl?: string
}

export class EstablishmentModel implements EstablishmentRepository {
  public async save({ establishment, userId }: {
    userId: string,
    establishment: RegisterEstablishmentEntity }): Promise<EstablishmentEntity> {
    let createEstablishment = {} as EstablishmentEntity;

    await prisma.$transaction(async (prismaHandler) => {
      try {
        let images = [] as ImageCreationSchema[];
        let commodities = [] as CommodityCreationSchema[];

        if (establishment.images?.length) {
          images = establishment.images.map((image) => ({
            url: image,
          }));
        }

        if (establishment.commodities?.length) {
          commodities = establishment.commodities.map((commodity) => ({
            name: commodity.name,
            commodityIconUrl: commodity.iconUrl,
          }));
        }

        createEstablishment = await prismaHandler.establishment.create({
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

            establishmentAttatchment: {
              create: {
                maxBookingHour: establishment.maxBookingHour,
                minBookingHour: establishment.minBookingHour,

                commodities: {
                  createMany: {
                    data: commodities,
                  },
                },

                images: {
                  createMany: {
                    data: images,
                  },
                },
              },
            },
          },

          include: {
            establishmentAttatchment: true,
          },
        }) as EstablishmentEntity;

        return createEstablishment;
      } catch (e) {
        console.log(e);
        throw e;
      }
    });

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
