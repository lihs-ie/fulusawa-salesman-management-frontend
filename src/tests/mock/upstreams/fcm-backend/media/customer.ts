import { v7 as uuid } from 'uuid';

import { EntryMedia, RawEntryMedia } from 'acl/fsm-backend/customer/templates';
import { Customer } from 'domains/customer';
import { Builder, StringFactory } from 'tests/factories';

import { Media } from '../../common';

import { AddressMedia, PhoneNumberMedia } from './common';

export class CustomerMedia extends Media<Partial<RawEntryMedia>, Customer> {
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

  protected fillByModel(overrides: Customer): RawEntryMedia {
    return {
      identifier: overrides.identifier.value,
      name: {
        first: overrides.firstName,
        last: overrides.lastName,
      },
      address: new AddressMedia(overrides.address).data(),
      phone: new PhoneNumberMedia(overrides.phone).data(),
      cemeteries: overrides.cemeteries.map((cemetery) => cemetery.value).toArray(),
      transactionHistories: overrides.transactionHistories
        .map((history) => history.value)
        .toArray(),
    };
  }

  protected fill(overrides?: Partial<RawEntryMedia> | Customer): RawEntryMedia {
    if (overrides instanceof Customer) {
      return this.fillByModel(overrides);
    }

    return {
      identifier: uuid(),
      name: {
        first: null,
        last: Builder.get(StringFactory(1, Customer.MAX_LAST_NAME_LENGTH)).build(),
      },
      address: new AddressMedia().data(),
      phone: new PhoneNumberMedia().data(),
      cemeteries: [],
      transactionHistories: [],
      ...overrides,
    };
  }
}

expect.extend({
  toBeExpectedCustomerMedia(actual: EntryMedia, expected: RawEntryMedia) {
    try {
      expect(actual.identifier).toBe(expected.identifier);
      expect(actual.name.first).toBe(expected.name.first);
      expect(actual.name.last).toBe(expected.name.last);
      expect(actual.address).toBeExpectedAddressMedia(expected.address);
      expect(actual.phone).toBeExpectedPhoneNumberMedia(expected.phone);
      expect(actual.cemeteries.toArray()).toStrictEqual(expected.cemeteries);
      expect(actual.transactionHistories.toArray()).toStrictEqual(expected.transactionHistories);

      return {
        message: () => 'OK',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => (error as Error).message,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeExpectedCustomerMedia(expected: RawEntryMedia): R;
    }
  }
}
