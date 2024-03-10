export class GlobalException extends Error {
  public constructor(msg:string, statusCode:number) {
    super(msg, {
      cause: {
        status: statusCode,
      },
    });

    this.message = msg;
  }
}
