import { GlobalException } from './global-exception';

export class AlreadyExistsException extends GlobalException {
  public constructor(data:string) {
    super(`${data} already exists.`, 409);
  }
}
