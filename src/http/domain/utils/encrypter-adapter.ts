import bcryptjs from 'bcryptjs';
import { Encrypter } from '../protocols';

export class EncrypterAdapter implements Encrypter {
  private saltRounds = 6;

  public async hash(string: string): Promise<string> {
    const hashPassword = await bcryptjs.hash(string, this.saltRounds);

    return hashPassword;
  }

  public async compare(base: string, encrypted: string): Promise<boolean> {
    const doesMatches = await bcryptjs.compare(base, encrypted);

    return doesMatches;
  }
}
