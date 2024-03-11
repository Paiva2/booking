export interface Encrypter {
  hash(string: string): Promise<string>
  compare(base: string, encrypted: string): Promise<boolean>
}
