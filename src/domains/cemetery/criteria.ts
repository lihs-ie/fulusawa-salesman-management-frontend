import { Map } from 'immutable';

import { ValueObject } from 'domains/common';
import { CustomerIdentifier } from 'domains/customer';

export class Criteria extends ValueObject {
  public constructor(public readonly customer: CustomerIdentifier | null) {
    super();
  }

  protected properties(): Map<string, unknown> {
    return Map({
      customer: this.customer,
    });
  }
}
