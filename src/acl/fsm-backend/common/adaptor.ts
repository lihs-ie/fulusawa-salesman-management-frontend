import createHttpError from 'http-errors';

import { Status } from 'aspects/http';

export abstract class AbstractAdaptor {
  protected readonly MIN_VALID_HTTP_STATUS = 200;
  protected readonly MAX_VALID_HTTP_STATUS = 299;

  protected verifyStatus(status: number): boolean {
    if (status < this.MIN_VALID_HTTP_STATUS) {
      return false;
    }

    if (this.MAX_VALID_HTTP_STATUS < status) {
      return false;
    }

    return true;
  }

  protected handleErrorResponse(response: Response): void {
    const status = response.status;
    const text = response.statusText;

    if (!this.verifyStatus(status)) {
      switch (status) {
        case Status.BAD_REQUEST:
          throw createHttpError.BadRequest(text);

        case Status.UNAUTHORIZED:
          throw createHttpError.Unauthorized(text);

        case Status.FORBIDDEN:
          throw createHttpError.Forbidden(text);

        case Status.NOT_FOUND:
          throw createHttpError.NotFound(text);

        case Status.CONFLICT:
          throw createHttpError.Conflict(text);

        default:
          throw createHttpError.InternalServerError(text);
      }
    }
  }
}
