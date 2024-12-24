import { v7 as uuid } from 'uuid';

import { EntryMedia, RawEntryMedia } from 'acl/fsm-backend/transaction-history/templates';
import { TransactionHistory } from 'domains/transaction-history';
import { Builder } from 'tests/factories';
import { TypeFactory } from 'tests/factories/domains/transaction-history';

import { Media } from '../../common';

export class TransactionHistoryMedia extends Media<Partial<RawEntryMedia>, TransactionHistory> {
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

  protected fillByModel(overrides: TransactionHistory): RawEntryMedia {
    return {
      identifier: overrides.identifier.value,
      customer: overrides.customer.value,
      user: overrides.user.value,
      date: overrides.date.toISOString(),
      type: overrides.type,
      description: overrides.description,
    };
  }

  protected fill(overrides?: Partial<RawEntryMedia> | TransactionHistory): RawEntryMedia {
    if (overrides instanceof TransactionHistory) {
      return this.fillByModel(overrides);
    }

    return {
      identifier: uuid(),
      customer: uuid(),
      user: uuid(),
      date: new Date().toISOString(),
      type: Builder.get(TypeFactory).build(),
      description: null,
      ...overrides,
    };
  }
}

expect.extend({
  toBeExpectedTransactionHistoryMedia(actual: EntryMedia, expected: RawEntryMedia) {
    try {
      expect(actual.identifier).toBe(expected.identifier);
      expect(actual.customer).toBe(expected.customer);
      expect(actual.user).toBe(expected.user);
      expect(actual.date.toISOString()).toBe(expected.date);
      expect(actual.type).toBe(expected.type);
      expect(actual.description).toBe(expected.description);

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
      toBeExpectedTransactionHistoryMedia(expected: RawEntryMedia): R;
    }
  }
}
