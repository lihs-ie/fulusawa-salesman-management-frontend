import { Map } from 'immutable';

import { ValueObject } from 'domains/common';

import { Status, Type } from './common';

export const Sort = {
  CREATED_AT_ASC: 'CREATED_AT_ASC',
  CREATED_AT_DESC: 'CREATED_AT_DESC',
  UPDATED_AT_ASC: 'UPDATED_AT_ASC',
  UPDATED_AT_DESC: 'UPDATED_AT_DESC',
} as const;

export type Sort = (typeof Sort)[keyof typeof Sort];

export class Criteria extends ValueObject {
  public constructor(
    public readonly type: Type | null,
    public readonly status: Status | null,
    public readonly sort: Sort | null
  ) {
    super();
  }

  protected properties(): Map<string, unknown> {
    return Map({
      type: this.type,
      status: this.status,
      sort: this.sort,
    });
  }
}
