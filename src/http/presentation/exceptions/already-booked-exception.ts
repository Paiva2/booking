import { GlobalException } from './global-exception';

export class AlreadyBookedException extends GlobalException {
  public constructor(msg: string) {
    super(`${msg} is already taken`, 409);
  }
}
