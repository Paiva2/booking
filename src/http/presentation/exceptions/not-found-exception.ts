import { GlobalException } from './global-exception';

export class NotFoundException extends GlobalException {
  public constructor(param: string) {
    super(`${param} not found`, 404);
  }
}
