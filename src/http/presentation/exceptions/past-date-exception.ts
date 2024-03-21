import { GlobalException } from './global-exception';

export class PastDateException extends GlobalException {
  public constructor(msg: string) {
    super(`${msg} can't be before today`, 409);
  }
}
