import { EstablishmentTypes } from '../enums';

export interface EstablishmentEntity {
  id:string
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
  complement: string
  establishmentAttatchmentId?: string
  createdAt: Date
  updatedAt: Date
}
