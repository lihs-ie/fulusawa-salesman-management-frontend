import { Map } from 'immutable';

import { ValueObject } from 'domains/common';
import { UserIdentifier } from 'domains/user';

export const Sort = {
  VISITED_AT_ASC: 'VISITED_AT_ASC',
  VISITED_AT_DESC: 'VISITED_AT_DESC',
} as const;

export type Sort = (typeof Sort)[keyof typeof Sort];

export class Criteria extends ValueObject {
  public constructor(
    public readonly user: UserIdentifier | null,
    public readonly sort: Sort | null
  ) {
    super();
  }

  protected properties(): Map<string, unknown> {
    return Map({
      user: this.user,
      sort: this.sort,
    });
  }
}
