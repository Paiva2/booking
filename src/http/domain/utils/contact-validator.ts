import validator from 'validator';

export function contactValidator(phone:string): boolean {
  return validator.isMobilePhone(phone, 'any');
}
