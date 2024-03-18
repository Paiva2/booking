import { EstablishmentRepository, UserRepository } from '../../../../data/repositories';
import { AlreadyExistsException, InvalidParamException, NotFoundException } from '../../../../presentation/exceptions';
import { EstablishmentEntity, RegisterEstablishmentEntity } from '../../../entities';
import { contactValidator, postalCodeValidator } from '../../../utils';
import { bookingHourValidator } from '../../../utils/booking-hour-validator';
import { Service } from '../../../protocols';

export class RegisterEstablishmentService implements Service {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly establishmentRepository: EstablishmentRepository,
  ) {}

  public async exec(dto: {
    userId:string,
    establishment: RegisterEstablishmentEntity }): Promise<EstablishmentEntity> {
    const { userId, establishment } = dto;

    if (!this.postalCodeCheck(establishment.zipcode)) {
      throw new InvalidParamException('zipcode');
    }

    if (!this.contactCheck(establishment.contact)) {
      throw new InvalidParamException('contact');
    }

    if (!this.countryAbbreviationCheck(establishment.country)) {
      throw new InvalidParamException('country');
    }

    const { maxBookingHour, minBookingHour } = establishment;

    if (!this.hourAndMinuteFormatCheck(maxBookingHour)) {
      throw new InvalidParamException('maxBookingHour');
    }

    if (!this.hourAndMinuteFormatCheck(minBookingHour)) {
      throw new InvalidParamException('minBookingHour');
    }

    const [maxHour, maxMin] = this.getMinAndHour(maxBookingHour);
    const [minHour, minMin] = this.getMinAndHour(minBookingHour);

    const dateWithMax = this.setDateWithHour(+maxHour, +maxMin);
    const dateWithMin = this.setDateWithHour(+minHour, +minMin);

    if (dateWithMin >= dateWithMax) {
      throw new InvalidParamException("maxBookingHour can't be less than minBookingHour");
    }

    const doesUserExists = await this.userRepository.findById(userId);

    if (!doesUserExists) {
      throw new NotFoundException('User');
    }

    const doesUserAlreadyHasEstablishmentName = await this.establishmentRepository.findByName({
      userId,
      name: establishment.name,
    });

    if (doesUserAlreadyHasEstablishmentName) {
      throw new AlreadyExistsException('An Establishment with this name');
    }

    const newEstablishment = await this.establishmentRepository.save({
      userId,
      establishment,
    });

    return newEstablishment;
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

  private getMinAndHour(hour: string) {
    const [hours, mins] = hour.split(':');

    return [hours, mins];
  }

  private setDateWithHour(hour: number, minute: number) {
    return new Date(new Date().setHours(hour, minute));
  }
}
