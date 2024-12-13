import { Address, PostalCode } from 'domains/common';
import { Builder, StringFactory } from 'tests/factories';
import { PostalCodeFactory, PrefectureFactory } from 'tests/factories/domains/common';

import { ValueObjectTest } from './value-object';

describe('Package address', () => {
  describe('Class PostalCode', () => {
    describe('instantiation', () => {
      it('success.', () => {
        const first = '123';
        const second = '4567';

        const instance = new PostalCode(first, second);

        expect(instance).toBeInstanceOf(PostalCode);
        expect(instance.first).toBe(first);
        expect(instance.second).toBe(second);
      });

      it.each([
        { first: '1234' },
        { second: '12345' },
        { second: '12345' },
        { first: '12' },
        { first: '' },
        { second: '' },
      ])('fails with invalid value.', (invalidValue) => {
        const values = {
          first: '123',
          second: '4567',
          ...invalidValue,
        };

        expect(() => new PostalCode(values.first, values.second)).toThrow();
      });
    });

    describe('toString', () => {
      it('returns concatenated value.', () => {
        const first = '123';
        const second = '4567';

        const expected = `${first}-${second}`;

        const instance = new PostalCode(first, second);

        expect(instance.toString()).toBe(expected);
      });
    });
  });

  describe('Class Address', () => {
    type Properties = ConstructorParameters<typeof Address>;

    const generator = (): Properties => [
      Builder.get(PrefectureFactory).build(),
      Builder.get(PostalCodeFactory).build(),
      'city',
      'street',
      null,
    ];

    describe('instantiation', () => {
      it('success.', () => {
        const props = generator();

        const instance = new Address(...props);

        expect(instance).toBeInstanceOf(Address);
        expect(instance.prefecture).toBe(props[0]);
        expect(instance.postalCode).toBe(props[1]);
        expect(instance.city).toBe(props[2]);
        expect(instance.street).toBe(props[3]);
        expect(instance.building).toBe(props[4]);
      });

      it.each([
        { city: '' },
        { street: '' },
        { city: 'a'.padEnd(Address.MAX_CITY_LENGTH + 1, 'a') },
        { street: 'a'.padEnd(Address.MAX_STREET_LENGTH + 1, 'a') },
        { building: 'a'.padEnd(Address.MAX_BUILDING_LENGTH + 1, 'a') },
      ])('fails with invalid value.', (invalid) => {
        const validProps = generator();

        const values = {
          prefecture: validProps[0],
          postalCode: validProps[1],
          city: validProps[2],
          street: validProps[3],
          building: validProps[4],
          ...invalid,
        };

        expect(
          () =>
            new Address(
              values.prefecture,
              values.postalCode,
              values.city,
              values.street,
              values.building
            )
        ).toThrow();
      });
    });

    ValueObjectTest(
      Address,
      generator,
      ([prefecture, postalCode, city, street]): Array<Properties> => [
        [
          prefecture,
          postalCode,
          city,
          street,
          Builder.get(StringFactory(1, Address.MAX_BUILDING_LENGTH)).build(),
        ],
      ]
    );
  });
});
