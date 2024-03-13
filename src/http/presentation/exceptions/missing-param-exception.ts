import { GlobalException } from './global-exception';

export class MissingParamException extends GlobalException {
  public constructor(msg:string) {
    super(`Missing param: ${msg}`, 400);
  }
}
