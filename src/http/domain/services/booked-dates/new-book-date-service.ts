import {
  BookedDatesRepository,
  EstablishmentAttatchmentRepository,
  UserRepository,
} from '../../../data/repositories';
import {
  AlreadyBookedException,
  ConflictException,
  InvalidParamException,
  NotFoundException,
  PastDateException,
} from '../../../presentation/exceptions';
import { dateConverterGmt } from '../../../presentation/utils';
import { Service } from '../../protocols';
import { dateValidator } from '../../utils';

export class NewBookDateService implements Service {
  public constructor(
    private readonly bookedDatesRepository: BookedDatesRepository,
    private readonly userRepository: UserRepository,
    private readonly establishmentAttatchment: EstablishmentAttatchmentRepository,
  ) {}

  public async exec(dto: {
    userId: string,
    establishmentAttatchmentId: string,
    bookedDate: string
  }): Promise<{
      id: string,
      bookedDate: string,
    }> {
    const { bookedDate, establishmentAttatchmentId, userId } = dto;

    if (!this.dateCheck(bookedDate)) {
      throw new InvalidParamException('bookedDate');
    }

    if (this.isDateBeforeToday(bookedDate)) {
      throw new PastDateException('Booked date provided');
    }

    const doesEstablishmentAttatchmentExists = await this.establishmentAttatchment.findById(
      establishmentAttatchmentId,
    );

    if (!doesEstablishmentAttatchmentExists) {
      throw new NotFoundException('Establishment attatchment');
    }

    if (doesEstablishmentAttatchmentExists.establishment?.ownerId === userId) {
      throw new ConflictException("An Establishment owner can't book dates on their own establishment.");
    }

    const doesEstablishmentAlreadyHasDateBooked = await this.bookedDatesRepository.findBookedDate({
      attatchmentId: establishmentAttatchmentId,
      bookedDate,
    });

    if (doesEstablishmentAlreadyHasDateBooked) {
      throw new AlreadyBookedException('Booked date provided');
    }

    const doesUserExists = await this.userRepository.findById(userId);

    if (!doesUserExists) {
      throw new NotFoundException('User');
    }

    const bookNewDate = await this.bookedDatesRepository.save({
      userId,
      bookedDate,
      establishmentAttatchmentId,
    });

    return {
      id: bookNewDate.id,
      bookedDate: this.convertDateToView(
        bookNewDate.bookedDate.toISOString(),
        doesUserExists.state,
      ),
    };
  }

  dateCheck(date: string): boolean {
    return dateValidator(date);
  }

  isDateBeforeToday(bookedDate: string) {
    return new Date(bookedDate) < new Date();
  }

  convertDateToView(originalDate: string, state: string) {
    return dateConverterGmt(originalDate, state);
  }
}
