import validator from 'validator';

export function emailValidator(email:string): boolean {
  return validator.isEmail(email);
}
