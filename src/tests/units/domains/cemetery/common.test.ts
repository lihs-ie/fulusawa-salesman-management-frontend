import { Cemetery, CemeteryIdentifier } from 'domains/cemetery';
import { Builder, StringFactory } from 'tests/factories';
import { CemeteryIdentifierFactory, CemeteryTypeFactory } from 'tests/factories/domains/cemetery';
import { CustomerIdentifierFactory } from 'tests/factories/domains/customer';

import { UniversallyUniqueIdentifierTest } from '../common/identifier';

describe('Package common', () => {
  describe('Class CemeteryIdentifier', () => {
    UniversallyUniqueIdentifierTest(CemeteryIdentifier);
  });

  describe('Class Cemetery', () => {
    type Properties = ConstructorParameters<typeof Cemetery>;

    const generator = (): Properties => [
      Builder.get(CemeteryIdentifierFactory).build(),
      Builder.get(CustomerIdentifierFactory).build(),
      Builder.get(StringFactory(1, Cemetery.MAX_NAME_LENGTH)).build(),
      Builder.get(CemeteryTypeFactory).build(),
      new Date(),
      Math.random() < 0.5,
    ];

    describe('instantiation', () => {
      it('success.', () => {
        const props = generator();

        const instance = new Cemetery(...props);

        expect(instance).toBeInstanceOf(Cemetery);
        expect(props[0].equals(instance.identifier)).toBeTruthy();
        expect(props[1].equals(instance.customer)).toBeTruthy();
        expect(instance.name).toBe(props[2]);
        expect(instance.type).toBe(props[3]);
        expect(instance.construction).toBe(props[4]);
        expect(instance.inHouse).toBe(props[5]);
      });

      it.each([{ name: '' }, { name: 'a'.padEnd(Cemetery.MAX_NAME_LENGTH + 1, 'a') }])(
        'fails with invalid value.',
        (invalid) => {
          const valids = generator();

          const values = {
            identifier: valids[0],
            customer: valids[1],
            type: valids[3],
            construction: valids[4],
            inHouse: valids[5],
            ...invalid,
          };

          expect(
            () =>
              new Cemetery(
                values.identifier,
                values.customer,
                values.name,
                values.type,
                values.construction,
                values.inHouse
              )
          ).toThrow();
        }
      );
    });
  });
});
