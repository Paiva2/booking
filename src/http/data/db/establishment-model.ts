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

  public async find(query: {
    page: number;
    perPage: number;
    name?: string | undefined;
    state?: string | undefined;
    city?: string | undefined;
  }): Promise<{ page: number; perPage: number; list: EstablishmentEntity[]; }> {
    const hasFilters = Object.keys(query)
      .filter((queries) => queries !== 'page' && queries !== 'perPage').length;

    const list = await prisma.establishment.findMany({
      where: hasFilters ? {
        OR: [
          query.name ? { name: { contains: query.name, mode: 'insensitive' } } : {},
          query.city ? { city: { contains: query.city, mode: 'insensitive' } } : {},
          query.state ? { state: { contains: query.state, mode: 'insensitive' } } : {},
        ],
      } : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            contact: true,
          },
        },
        establishmentAttatchment: {
          select: {
            id: true,
            establishmentId: true,
            maxBookingHour: true,
            minBookingHour: true,
            commodities: {
              select: {
                id: true,
                name: true,
                commodityIconUrl: true,
              },
            },
            images: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },
      skip: (query.page - 1) * query.perPage,
      take: query.perPage,
      orderBy: {
        createdAt: 'desc',
      },
    }) as EstablishmentEntity[];

    return {
      page: query.page,
      perPage: query.perPage,
      list,
    };
  }

  public async findById(id: string): Promise<EstablishmentEntity | null> {
    const find = await prisma.establishment.findFirst({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            contact: true,
          },
        },
        establishmentAttatchment: {
          select: {
            id: true,
            establishmentId: true,
            maxBookingHour: true,
            minBookingHour: true,
            images: {
              select: {
                id: true,
                url: true,
              },
            },
            commodities: {
              select: {
                id: true,
                name: true,
                commodityIconUrl: true,
              },
            },
            bookedDates: {
              select: {
                id: true,
                bookedDate: true,
                userId: true,
              },
              where: {
                bookedDate: {
                  gte: new Date().toISOString(),
                },
              },
            },
          },
        },
      },
    }) as EstablishmentEntity;

    return find;
  }

  public async findAllByUserId(params: {
    userId: string;
    page: number;
    perPage: number;
    orderBy: 'asc' | 'desc';
    name?: string | undefined;
  }): Promise<{ page: number; perPage: number; list: EstablishmentEntity[]; }> {
    const {
      page,
      perPage,
      userId,
      orderBy,
    } = params;

    const findAll = await prisma.establishment.findMany({
      where: {
        ownerId: userId,
        AND: {
          name: params.name ? { contains: params.name, mode: 'insensitive' } : {},
        },
      },
      include: {
        establishmentAttatchment: {
          select: {
            id: true,
            establishmentId: true,
            createdAt: true,
            updatedAt: true,
            maxBookingHour: true,
            minBookingHour: true,
            images: {
              select: {
                id: true,
                url: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            commodities: {
              select: {
                id: true,
                name: true,
                commodityIconUrl: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            bookedDates: {
              select: {
                id: true,
                bookedDate: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: orderBy,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }) as EstablishmentEntity[];

    return {
      page,
      perPage: params.perPage,
      list: findAll,
    };
  }
}
