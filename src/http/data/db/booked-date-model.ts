import { BookedDateEntity } from '../../domain/entities';
import { NewBookedDateEntity } from '../../domain/entities/booked-date/new-booked-date-entity';
import { BookedDatesRepository } from '../repositories';
import prisma from '../lib/prisma';

export class BookedDateModel implements BookedDatesRepository {
  async findBookedDate(params: {
    attatchmentId: string;
    bookedDate: string;
  }): Promise<BookedDateEntity | null> {
    const findDate = await prisma.bookedDate.findFirst({
      where: {
        establishmentAttatchmentId: params.attatchmentId,
        bookedDate: params.bookedDate,
      },
    });

    return findDate;
  }

  async save(create: NewBookedDateEntity): Promise<BookedDateEntity> {
    const createDate = await prisma.bookedDate.create({
      data: {
        bookedDate: create.bookedDate,
        userId: create.userId,
        establishmentAttatchmentId: create.establishmentAttatchmentId,
      },
    });

    return createDate;
  }

  async findAllFromUser(params:{
    page: number;
    perPage: number;
    userId: string;
  }): Promise<{ page: number; perPage: number; list: BookedDateEntity[]; }> {
    const list = await prisma.bookedDate.findMany({
      where: {
        userId: params.userId,
      },
      include: {
        establishmentAttatchment: {
          select: {
            id: true,
            establishment: {
              select: {
                id: true,
                ownerId: true,
                name: true,
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
                user: {
                  select: {
                    id: true,
                    name: true,
                    contact: true,
                    email: true,
                  },
                },
              },
            },
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
          },
        },
      },
      skip: (params.page - 1) * params.perPage,
      take: params.perPage,
    }) as BookedDateEntity[];

    return {
      page: params.page,
      perPage: params.perPage,
      list,
    };
  }
}
