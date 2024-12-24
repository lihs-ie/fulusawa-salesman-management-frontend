import {
  AddressMedia as RawAddressMedia,
  PhoneNumberMedia as RawPhoneNumberMedia,
} from 'acl/fsm-backend/common';
import { Address, PhoneNumber } from 'domains/common';
import { Builder } from 'tests/factories';
import { AddressFactory } from 'tests/factories/domains/common';
import { PhoneNumberFactory } from 'tests/factories/domains/common/contact';

import { Media } from '../../common';

export class AddressMedia extends Media<Partial<RawAddressMedia>, Address> {
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

  protected fillByModel(overrides: Address): RawAddressMedia {
    return {
      prefecture: overrides.prefecture,
      postalCode: {
        first: overrides.postalCode.first,
        second: overrides.postalCode.second,
      },
      city: overrides.city,
      street: overrides.street,
      building: overrides.building,
    };
  }

  protected fill(overrides?: Partial<RawAddressMedia> | Address): RawAddressMedia {
    if (overrides instanceof Address) {
      return this.fillByModel(overrides);
    }

    const address = Builder.get(AddressFactory).build();

    return {
      prefecture: address.prefecture,
      postalCode: {
        first: address.postalCode.first,
        second: address.postalCode.second,
      },
      city: address.city,
      street: address.street,
      building: address.building,
      ...overrides,
    };
  }
}

expect.extend({
  toBeExpectedAddressMedia(actual: RawAddressMedia, expected: RawAddressMedia) {
    try {
      expect(actual.prefecture).toBe(expected.prefecture);
      expect(actual.postalCode.first).toBe(expected.postalCode.first);
      expect(actual.postalCode.second).toBe(expected.postalCode.second);
      expect(actual.city).toBe(expected.city);
      expect(actual.street).toBe(expected.street);
      expect(actual.building).toBe(expected.building);

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

export class PhoneNumberMedia extends Media<Partial<RawPhoneNumberMedia>, PhoneNumber> {
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

  protected fillByModel(overrides: PhoneNumber): RawPhoneNumberMedia {
    return {
      areaCode: overrides.areaCode,
      localCode: overrides.localCode,
      subscriberNumber: overrides.subscriberNumber,
    };
  }

  protected fill(overrides?: Partial<RawPhoneNumberMedia> | PhoneNumber): RawPhoneNumberMedia {
    if (overrides instanceof PhoneNumber) {
      return this.fillByModel(overrides);
    }

    const phone = Builder.get(PhoneNumberFactory).build();

    return {
      areaCode: phone.areaCode,
      localCode: phone.localCode,
      subscriberNumber: phone.subscriberNumber,
      ...overrides,
    };
  }
}

expect.extend({
  toBeExpectedPhoneNumberMedia(actual: RawPhoneNumberMedia, expected: RawPhoneNumberMedia) {
    try {
      expect(actual.areaCode).toBe(expected.areaCode);
      expect(actual.localCode).toBe(expected.localCode);
      expect(actual.subscriberNumber).toBe(expected.subscriberNumber);

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
      toBeExpectedAddressMedia(expected: RawAddressMedia): R;
      toBeExpectedPhoneNumberMedia(expected: RawPhoneNumberMedia): R;
    }
  }
}
