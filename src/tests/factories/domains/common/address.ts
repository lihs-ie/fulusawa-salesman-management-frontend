import { createDigits } from 'aspects/character';
import { Address, PostalCode, Prefecture } from 'domains/common';
import { Builder, EnumFactory, Factory } from 'tests/factories/common';

export const PrefectureFactory = EnumFactory(Prefecture);

type PostalCodeProperties = {
  first: string;
  second: string;
};

export class PostalCodeFactory extends Factory<PostalCode, PostalCodeProperties> {
  protected instantiate(properties: PostalCodeProperties): PostalCode {
    return new PostalCode(properties.first, properties.second);
  }

  protected prepare(overrides: Partial<PostalCodeProperties>, seed: number): PostalCodeProperties {
    return {
      first: createDigits(seed, 3),
      second: createDigits(seed, 4),
      ...overrides,
    };
  }

  protected retrieve(instance: PostalCode): PostalCodeProperties {
    return {
      first: instance.first,
      second: instance.second,
    };
  }
}

type AddressProperties = {
  postalCode: PostalCode;
  prefecture: Prefecture;
  city: string;
  street: string;
  building: string | null;
};

export class AddressFactory extends Factory<Address, AddressProperties> {
  protected instantiate(properties: AddressProperties): Address {
    return new Address(
      properties.prefecture,
      properties.postalCode,
      properties.city,
      properties.street,
      properties.building
    );
  }

  protected prepare(overrides: Partial<AddressProperties>, seed: number): AddressProperties {
    return {
      postalCode: Builder.get(PostalCodeFactory).buildWith(seed),
      prefecture: Builder.get(PrefectureFactory).buildWith(seed),
      city: 'city'.padEnd(Math.min(Math.trunc(seed % 10), Address.MAX_CITY_LENGTH), '0'),
      street: 'street'.padEnd(Math.min(Math.trunc(seed % 10), Address.MAX_STREET_LENGTH), '0'),
      building: null,
      ...overrides,
    };
  }

  protected retrieve(instance: Address): AddressProperties {
    return {
      postalCode: instance.postalCode,
      prefecture: instance.prefecture,
      city: instance.city,
      street: instance.street,
      building: instance.building,
    };
  }
}
