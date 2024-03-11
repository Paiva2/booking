import bcryptjs from 'bcryptjs';
import { Encrypter } from '../protocols';

export class EncrypterAdapter implements Encrypter {
  public async hash(string: string): Promise<string> {
    const hashPassword = await bcryptjs.hash(string, 6);

    return hashPassword;
  }

  public async compare(base: string, encrypted: string): Promise<boolean> {
    const doesMatches = await bcryptjs.compare(base, encrypted);

    return doesMatches;
  }
}
