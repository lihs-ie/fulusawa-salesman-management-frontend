export class NotFound extends Error {
  public static readonly STATUS = 404;
  public constructor(message = 'Not Found') {
    super(message);
    this.name = 'Not Found Error';
  }
}
