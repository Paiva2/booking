import { BookedDateEntity } from '../../domain/entities';
import { NewBookedDateEntity } from '../../domain/entities/booked-date/new-booked-date-entity';
import prisma from '../lib/prisma';
import { BookedDatesRepository } from '../repositories';

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
}
