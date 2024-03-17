import { EstablishmentTypes } from '../enums';

export interface RegisterEstablishmentEntity {
  type: EstablishmentTypes
  name: string,
  description: string
  ownerId: string
  street: string,
  neighbourhood: string
  zipcode: string
  number: string
  city: string
  state: string
  country: string
  complement?: string
}
