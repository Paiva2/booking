import { EstablishmentImage } from '@prisma/client';
import { EstablishmentTypes } from '../enums';
import { CommodityEntity } from '..';

export interface RegisterEstablishmentEntity {
  type: EstablishmentTypes
  name: string,
  description: string
  contact: string,
  street: string,
  neighbourhood: string
  zipcode: string
  maxBookingHour: string
  minBookingHour: string
  number: string
  city: string
  state: string
  country: string
  complement?: string
  images?: EstablishmentImage[]
  commodities?: CommodityEntity[]
}
