import { GlobalException } from './global-exception';

export class ForbiddenException extends GlobalException {
  public constructor(msg: string) {
    super(msg, 403);
  }
}
