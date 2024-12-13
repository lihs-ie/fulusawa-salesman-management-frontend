import { Map } from 'immutable';

import { DateTimeRange, ValueObject } from 'domains/common';
import { UserIdentifier } from 'domains/user';

export class Criteria extends ValueObject {
  public constructor(
    public readonly date: DateTimeRange | null,
    public readonly user: UserIdentifier | null,
    public readonly isSubmitted: boolean | null
  ) {
    super();
  }

  protected properties(): Map<string, unknown> {
    return Map({
      date: this.date,
      user: this.user,
      isSubmitted: this.isSubmitted,
    });
  }
}
