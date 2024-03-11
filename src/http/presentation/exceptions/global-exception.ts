export class GlobalException extends Error {
  public status;

  public constructor(msg:string, statusCode:number) {
    super(msg);

    this.status = statusCode;
    this.message = msg;
  }
}
