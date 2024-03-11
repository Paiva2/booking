import validator from 'validator';

export function postalCodeValidator(postalCode:string): boolean {
  return validator.isPostalCode(postalCode, 'any');
}
