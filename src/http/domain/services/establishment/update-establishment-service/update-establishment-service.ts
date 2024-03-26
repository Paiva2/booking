import {
  EstablishmentAttatchmentRepository,
  EstablishmentRepository,
} from '../../../../data/repositories';
import {
  AlreadyExistsException,
  ForbiddenException,
  InvalidParamException,
  NotFoundException,
} from '../../../../presentation/exceptions';
import { EstablishmentEntity } from '../../../entities';
import { UpdateEstablishmentEntity } from '../../../entities/establishment/update-establishment-entity';
import { Service } from '../../../protocols';
import { contactValidator, postalCodeValidator } from '../../../utils';
import { bookingHourValidator } from '../../../utils/booking-hour-validator';

export class UpdateEstablishmentService implements Service {
  public constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly establishmentAttatchmentRepository: EstablishmentAttatchmentRepository,
  ) {}

  public async exec({ ownerId, update }: {
    ownerId: string,
    update: UpdateEstablishmentEntity,
  }): Promise<EstablishmentEntity> {
    if (update.zipcode && !this.postalCodeCheck(update.zipcode)) {
      throw new InvalidParamException('zipcode');
    }

    if (update.contact && !this.contactCheck(update.contact)) {
      throw new InvalidParamException('contact');
    }

    if (update.country && !this.countryAbbreviationCheck(update.country)) {
      throw new InvalidParamException('country');
    }

    const doesEstablishmentAttatchmentExists = await this.establishmentAttatchmentRepository
      .findById(update.id);

    if (!doesEstablishmentAttatchmentExists) {
      throw new NotFoundException('Establishment Attatchment');
    }

    if (update.maxBookingHour && update.minBookingHour) {
      this.validateMaxAndMinHour({
        maxBookingHour: update.maxBookingHour,
        minBookingHour: update.minBookingHour,
      });
    }

    if (update.maxBookingHour) {
      this.validateMaxAndMinHour({
        maxBookingHour: update.maxBookingHour,
        minBookingHour: doesEstablishmentAttatchmentExists.minBookingHour,
      });
    } else if (update.minBookingHour) {
      this.validateMaxAndMinHour({
        maxBookingHour: doesEstablishmentAttatchmentExists.maxBookingHour,
        minBookingHour: update.minBookingHour,
      });
    }

    if (update.name) {
      const doesUserAlreadyHasEstablishmentName = await this.establishmentRepository.findByName({
        userId: ownerId,
        name: update.name,
      });

      if (doesUserAlreadyHasEstablishmentName) {
        throw new AlreadyExistsException('An Establishment with this name');
      }
    }

    const doesRequestOwnsEstablishment = await this.establishmentRepository.findById(update.id);

    if (!doesRequestOwnsEstablishment) {
      throw new NotFoundException('Establishment');
    }

    if (doesRequestOwnsEstablishment?.ownerId !== ownerId) {
      throw new ForbiddenException('Requester does not owns this establishment');
    }

    const updateEstablishment = await this.establishmentRepository.update({
      ownerId,
      args: update,
    });

    return updateEstablishment;
  }

  postalCodeCheck(postalCode:string): boolean {
    return postalCodeValidator(postalCode);
  }

  contactCheck(contact:string): boolean {
    return contactValidator(contact);
  }

  countryAbbreviationCheck(country: string): boolean {
    return country === 'BR';
  }

  hourAndMinuteFormatCheck(hourAndMin: string) {
    return bookingHourValidator(hourAndMin);
  }

  private getMinutesAndHour(hour: string) {
    const [hours, mins] = hour.split(':');

    return [hours, mins];
  }

  private makeDate(hour: number, minute: number) {
    return new Date(new Date().setHours(hour, minute));
  }

  private validateMaxAndMinHour(hours: { maxBookingHour: string, minBookingHour: string }) {
    if (!this.hourAndMinuteFormatCheck(hours.maxBookingHour)) {
      throw new InvalidParamException('maxBookingHour');
    }

    if (!this.hourAndMinuteFormatCheck(hours.minBookingHour)) {
      throw new InvalidParamException('minBookingHour');
    }

    const [maxHour, maxMin] = this.getMinutesAndHour(hours.maxBookingHour);
    const [minHour, minMin] = this.getMinutesAndHour(hours.minBookingHour);

    const dateWithMax = this.makeDate(+maxHour, +maxMin);
    const dateWithMin = this.makeDate(+minHour, +minMin);

    if (dateWithMin >= dateWithMax) {
      throw new InvalidParamException("maxBookingHour can't be less than minBookingHour");
    }
  }
}
