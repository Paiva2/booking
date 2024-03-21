import validator from 'validator';

export function dateValidator(date: string): boolean {
  return validator.isISO8601(date);
}
