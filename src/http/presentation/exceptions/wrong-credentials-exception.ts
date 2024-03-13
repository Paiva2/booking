import { GlobalException } from './global-exception';

export class WrongCredentialsException extends GlobalException {
  public constructor() {
    super('Wrong credentials.', 403);
  }
}
