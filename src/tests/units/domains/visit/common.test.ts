import { Visit, VisitIdentifier } from 'domains/visit';
import { Builder } from 'tests/factories';
import { AddressFactory } from 'tests/factories/domains/common';
import { UserIdentifierFactory } from 'tests/factories/domains/user';
import { ResultFactory, VisitIdentifierFactory } from 'tests/factories/domains/visit';

import { UniversallyUniqueIdentifierTest } from '../common/identifier';

describe('Package common', () => {
  describe('Class VisitIdentifier', () => {
    UniversallyUniqueIdentifierTest(VisitIdentifier);
  });

  describe('Class Visit', () => {
    type Properties = ConstructorParameters<typeof Visit>;

    const generator = (): Properties => [
      Builder.get(VisitIdentifierFactory).build(),
      Builder.get(UserIdentifierFactory).build(),
      new Date(),
      Builder.get(AddressFactory).build(),
      null,
      Math.random() < 0.5,
      null,
      Builder.get(ResultFactory).build(),
    ];

    describe('instantiate', () => {
      it('success', () => {
        const props = generator();

        const instance = new Visit(...props);

        expect(instance).toBeInstanceOf(Visit);
        expect(instance.identifier).toEqualValueObject(props[0]);
        expect(instance.user).toEqualValueObject(props[1]);
        expect(instance.visitedAt).toBe(props[2]);
        expect(instance.address).toEqualValueObject(props[3]);
        expect(instance.phone).toBeNullOr(props[4], (expectedPhone, actualPhone) =>
          expect(actualPhone).toEqualValueObject(expectedPhone)
        );
        expect(instance.hasGraveyard).toBe(props[5]);
        expect(instance.note).toBe(props[6]);
        expect(instance.result).toBe(props[7]);
      });

      it.each([{ note: '' }, { note: 'a'.repeat(Visit.MAX_NOTE_LENGTH + 1) }])(
        'fails with invalid value %s',
        (invalid) => {
          const valids = generator();

          const props = {
            identifier: valids[0],
            user: valids[1],
            visitedAt: valids[2],
            address: valids[3],
            phone: valids[4],
            hasGraveyard: valids[5],
            note: invalid.note,
            result: valids[7],
          };

          expect(
            () =>
              new Visit(
                props.identifier,
                props.user,
                props.visitedAt,
                props.address,
                props.phone,
                props.hasGraveyard,
                props.note,
                props.result
              )
          ).toThrow();
        }
      );
    });
  });
});
