import { v7 as uuid } from 'uuid';

import { EntryMedia, RawEntryMedia } from 'acl/fsm-backend/cemetery/templates';
import { Cemetery } from 'domains/cemetery';
import { Builder, StringFactory } from 'tests/factories';
import { CemeteryTypeFactory } from 'tests/factories/domains/cemetery';

import { Media } from '../../common';

export class CemeteryMedia extends Media<Partial<RawEntryMedia>, Cemetery> {
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

  protected fillByModel(overrides: Cemetery): RawEntryMedia {
    return {
      identifier: overrides.identifier.value,
      customer: overrides.customer.value,
      name: overrides.name,
      type: overrides.type,
      construction: overrides.construction.toISOString(),
      inHouse: overrides.inHouse,
    };
  }

  protected fill(overrides?: Partial<RawEntryMedia> | Cemetery): RawEntryMedia {
    if (overrides instanceof Cemetery) {
      return this.fillByModel(overrides);
    }

    return {
      identifier: uuid(),
      customer: uuid(),
      name: Builder.get(StringFactory(1, Cemetery.MAX_NAME_LENGTH)).build(),
      type: Builder.get(CemeteryTypeFactory).build(),
      construction: new Date().toISOString(),
      inHouse: Math.random() < 0.5,
      ...overrides,
    };
  }
}

expect.extend({
  toBeExpectedCemeteryMedia(actual: EntryMedia, expected: RawEntryMedia) {
    try {
      expect(actual.identifier).toBe(expected.identifier);
      expect(actual.customer).toBe(expected.customer);
      expect(actual.name).toBe(expected.name);
      expect(actual.type).toBe(expected.type);
      expect(actual.construction.toISOString()).toBe(expected.construction);
      expect(actual.inHouse).toBe(expected.inHouse);

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
      toBeExpectedCemeteryMedia(expected: RawEntryMedia): R;
    }
  }
}
