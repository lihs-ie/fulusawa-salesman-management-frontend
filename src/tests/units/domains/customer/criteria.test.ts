import { Criteria } from 'domains/customer';
import { Builder, StringFactory } from 'tests/factories';
import { PostalCodeFactory } from 'tests/factories/domains/common';
import { PhoneNumberFactory } from 'tests/factories/domains/common/contact';

import { ValueObjectTest } from '../common/value-object';

describe('Package criteria', () => {
  describe('Class Criteria', () => {
    type Properties = ConstructorParameters<typeof Criteria>;

    const generator = (): Properties => [null, null, null];

    describe('instantiation', () => {
      it('success.', () => {
        const props = generator();

        const instance = new Criteria(...props);

        expect(instance).toBeInstanceOf(Criteria);
        expect(instance.name).toBe(props[0]);
        expect(instance.postalCode).toBe(props[1]);
        expect(instance.phone).toBe(props[2]);
      });

      it.each([{ name: '' }, { name: 'a'.padEnd(Criteria.MAX_NAME_LENGTH + 1, 'a') }])(
        'fails with invalid value.',
        (invalid) => {
          const valids = generator();

          const props = {
            postalCode: valids[1],
            phone: valids[2],
            ...invalid,
          };

          expect(() => new Criteria(props.name, props.postalCode, props.phone)).toThrow();
        }
      );
    });

    ValueObjectTest(
      Criteria,
      generator,
      ([name, postalCode, phone]): Array<Properties> => [
        [Builder.get(StringFactory(1, Criteria.MAX_NAME_LENGTH)).build(), postalCode, phone],
        [name, Builder.get(PostalCodeFactory).build(), phone],
        [name, postalCode, Builder.get(PhoneNumberFactory).build()],
      ]
    );
  });
});
