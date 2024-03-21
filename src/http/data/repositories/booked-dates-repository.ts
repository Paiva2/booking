import { BookedDateEntity } from '../../domain/entities';
import { NewBookedDateEntity } from '../../domain/entities/booked-date/new-booked-date-entity';

export interface BookedDatesRepository {
  findBookedDate(params: {
    attatchmentId: string,
    bookedDate: string
  }): Promise<BookedDateEntity | null>;

  save(create: NewBookedDateEntity): Promise<BookedDateEntity>;
}
