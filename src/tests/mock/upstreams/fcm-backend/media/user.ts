import { v7 as uuid } from 'uuid';

import { EntryMedia, RawEntryMedia } from 'acl/fsm-backend/user/templates';
import { User } from 'domains/user';
import { Builder, StringFactory } from 'tests/factories';
import { MailAddressFactory } from 'tests/factories/domains/common/contact';
import { RoleFactory } from 'tests/factories/domains/user';

import { Media } from '../../common';

import { AddressMedia, PhoneNumberMedia } from './common';

export class UserMedia extends Media<Partial<RawEntryMedia>, User> {
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

  protected fillByModel(overrides: User): RawEntryMedia {
    return {
      identifier: overrides.identifier.value,
      name: {
        first: overrides.firstName,
        last: overrides.lastName,
      },
      address: new AddressMedia(overrides.address).data(),
      phone: new PhoneNumberMedia(overrides.phone).data(),
      email: overrides.email.toString(),
      role: overrides.role,
    };
  }

  protected fill(overrides?: Partial<RawEntryMedia> | User): RawEntryMedia {
    if (overrides instanceof User) {
      return this.fillByModel(overrides);
    }

    return {
      identifier: uuid(),
      name: {
        first: Builder.get(StringFactory(1, User.MAX_FIRST_NAME_LENGTH)).build(),
        last: Builder.get(StringFactory(1, User.MAX_LAST_NAME_LENGTH)).build(),
      },
      address: new AddressMedia().data(),
      phone: new PhoneNumberMedia().data(),
      email: Builder.get(MailAddressFactory).build().toString(),
      role: Builder.get(RoleFactory).build(),
      ...overrides,
    };
  }
}

expect.extend({
  toBeExpectedUserMedia(actual: EntryMedia, expected: RawEntryMedia) {
    try {
      expect(actual.identifier).toBe(expected.identifier);
      expect(actual.name.first).toBe(expected.name.first);
      expect(actual.name.last).toBe(expected.name.last);
      expect(actual.address).toBeExpectedAddressMedia(expected.address);
      expect(actual.phone).toBeExpectedPhoneNumberMedia(expected.phone);
      expect(actual.email).toBe(expected.email);
      expect(actual.role).toBe(expected.role);

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
      toBeExpectedUserMedia(expected: RawEntryMedia): R;
    }
  }
}
