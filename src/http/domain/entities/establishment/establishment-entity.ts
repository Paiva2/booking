import { EstablishmentAttatchmentEntity, UserEntity } from '..';
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
  establishmentAttatchment?: EstablishmentAttatchmentEntity
  createdAt?: Date
  updatedAt?: Date
  user?: Pick<UserEntity, 'id' | 'email' | 'name' | 'contact'>
}
