import { Map } from 'immutable';

import { ValueObject } from 'domains/common';
import { CustomerIdentifier } from 'domains/customer';
import { UserIdentifier } from 'domains/user';

export const Sort = {
  CREATED_AT_ASC: 'CREATED_AT_ASC',
  CREATED_AT_DESC: 'CREATED_AT_DESC',
  UPDATED_AT_ASC: 'UPDATED_AT_ASC',
  UPDATED_AT_DESC: 'UPDATED_AT_DESC',
} as const;

export type Sort = (typeof Sort)[keyof typeof Sort];

export class Criteria extends ValueObject {
  public constructor(
    public readonly user: UserIdentifier | null,
    public readonly customer: CustomerIdentifier | null,
    public readonly sort: Sort | null
  ) {
    super();
  }

  protected properties(): Map<string, unknown> {
    return Map({
      user: this.user,
      customer: this.customer,
      sort: this.sort,
    });
  }
}
