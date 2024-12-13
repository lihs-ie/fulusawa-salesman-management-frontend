import { Map } from 'immutable';

import { DateTimeRange, ValueObject } from 'domains/common';
import { UserIdentifier } from 'domains/user';

import { Status } from './common';

export class Criteria extends ValueObject {
  public static readonly MAX_TITLE_LENGTH = 255;

  public constructor(
    public readonly status: Status | null,
    public readonly date: DateTimeRange | null,
    public readonly title: string | null,
    public readonly user: UserIdentifier | null
  ) {
    if (title !== null && (title === '' || Criteria.MAX_TITLE_LENGTH < title.length)) {
      throw new Error(`Title must be 1 to ${Criteria.MAX_TITLE_LENGTH} characters.`);
    }

    super();
  }

  protected properties(): Map<string, unknown> {
    return Map({
      status: this.status,
      date: this.date,
      title: this.title,
      user: this.user,
    });
  }
}
