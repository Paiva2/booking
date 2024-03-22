import { GlobalException } from './global-exception';

export class ConflictException extends GlobalException {
  public constructor(msg: string) {
    super(msg, 409);
  }
}
