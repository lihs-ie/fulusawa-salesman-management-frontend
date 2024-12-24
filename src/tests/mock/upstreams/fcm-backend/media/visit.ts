import { v7 as uuid } from 'uuid';

import { EntryMedia, RawEntryMedia } from 'acl/fsm-backend/visit/templates';
import { Visit } from 'domains/visit';
import { Builder } from 'tests/factories';
import { ResultFactory } from 'tests/factories/domains/visit';

import { Media } from '../../common';

import { AddressMedia, PhoneNumberMedia } from './common';

export class VisitMedia extends Media<Partial<RawEntryMedia>, Visit> {
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

  protected fillByModel(overrides: Visit): RawEntryMedia {
    return {
      identifier: overrides.identifier.value,
      user: overrides.user.value,
      visitedAt: overrides.visitedAt.toISOString(),
      address: new AddressMedia(overrides.address).data(),
      phone: overrides.phone ? new PhoneNumberMedia(overrides.phone).data() : null,
      hasGraveyard: overrides.hasGraveyard,
      note: overrides.note,
      result: overrides.result,
    };
  }

  protected fill(overrides?: Partial<RawEntryMedia> | Visit): RawEntryMedia {
    if (overrides instanceof Visit) {
      return this.fillByModel(overrides);
    }

    return {
      identifier: uuid(),
      user: uuid(),
      visitedAt: new Date().toISOString(),
      address: new AddressMedia().data(),
      phone: null,
      hasGraveyard: Math.random() < 0.5,
      note: null,
      result: Builder.get(ResultFactory).build(),
      ...overrides,
    };
  }
}

expect.extend({
  toBeExpectedVisitMedia(actual: EntryMedia, expected: RawEntryMedia) {
    try {
      expect(actual.identifier).toBe(expected.identifier);
      expect(actual.user).toBe(expected.user);
      expect(actual.visitedAt.toISOString()).toBe(expected.visitedAt);
      expect(actual.address).toBeExpectedAddressMedia(expected.address);
      expect(actual.phone).toBeNullOr(expected.phone, (expectedPhone, actualPhone) =>
        expect(actualPhone).toBeExpectedPhoneNumberMedia(expectedPhone)
      );
      expect(actual.hasGraveyard).toBe(expected.hasGraveyard);
      expect(actual.note).toBe(expected.note);
      expect(actual.result).toBe(expected.result);

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
      toBeExpectedVisitMedia(expected: RawEntryMedia): R;
    }
  }
}
