import { EstablishmentTypes } from '../enums';

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
  images: string[]
  commodities: string[]
}
