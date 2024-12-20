import { List, Range } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/customer/templates';
import { Customer } from 'domains/customer';

import { Media } from '../../common';

import { CustomerMedia } from './customer';

export class CustomersMedia extends Media<Partial<RawEntriesMedia>, List<Customer>> {
  public createSuccessfulContent(): string {
    return JSON.stringify(this._data);
  }

  public createFailureContent(): string {
    return JSON.stringify({
      errors: [
        {
          reason: 101,
          cause: 'unit',
          value: 'sku099',
        },
      ],
    });
  }

  protected fillByModel(overrides: List<Customer>): RawEntriesMedia {
    return {
      customers: overrides.map((override) => new CustomerMedia(override).data()).toArray(),
    };
  }

  protected fill(overrides?: Partial<RawEntriesMedia> | List<Customer>): RawEntriesMedia {
    if (List.isList(overrides)) {
      return this.fillByModel(overrides);
    }

    const customers = Range(1, Math.floor(Math.random() * 10) + 1)
      .map(() => new CustomerMedia().data())
      .toArray();

    return { customers };
  }
}
