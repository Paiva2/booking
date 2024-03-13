import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwtHandler } from '../protocols';
import { GlobalException } from '../exceptions/global-exception';
import 'dotenv/config';

export class JwtHandlerAdapter implements JwtHandler {
  private SECRET = process.env.TOKEN_SECRET;

  private EXP_TIME = '7d';

  private ISSUER = process.env.TOKEN_ISSUEER;

  sign(subject: string): string {
    let token = '';

    try {
      token = jwt.sign(subject, this.SECRET!, {
        issuer: this.ISSUER,
        expiresIn: this.EXP_TIME,
      });
    } catch (e) {
      console.error(e);
      throw new GlobalException('Error while signing the token', 422);
    }

    return token;
  }

  decode(token: string): string {
    let decodedToken = '';

    try {
      const jwtPayload = jwt.verify(token, this.SECRET!, {
        issuer: this.ISSUER,
      }) as JwtPayload;

      decodedToken = jwtPayload.sub!;
    } catch (e) {
      console.error(e);
      throw new GlobalException('Error while decoding the token', 422);
    }

    return decodedToken;
  }
}
