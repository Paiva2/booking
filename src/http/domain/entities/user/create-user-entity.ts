export interface CreateUserEntity {
  name:string,
  email: string,
  password:string,
  contact:string,
  address: {
    street:string,
    zipcode: string,
    neighbourhood:string,
    number:string,
    complement:string,
    state:string,
    city:string,
  }
}
