import { GlobalException } from './global-exception';

export class InvalidParamException extends GlobalException {
  public constructor(msg:string) {
    super(`Invalid param: ${msg}`, 400);
  }
}
