export interface JwtHandler {
  sign(subject: string): string
  decode(token: string): string
}
