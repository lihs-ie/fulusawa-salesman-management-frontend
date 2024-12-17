import { Criteria } from 'domains/daily-report';
import { Builder } from 'tests/factories';
import { DateTimeRangeFactory } from 'tests/factories/domains/common';
import { UserIdentifierFactory } from 'tests/factories/domains/user';

import { ValueObjectTest } from '../common/value-object';

describe('Package criteria', () => {
  describe('Class Criteria', () => {
    type Properties = ConstructorParameters<typeof Criteria>;

    const generator = (): Properties => [
      Builder.get(DateTimeRangeFactory).build(),
      Builder.get(UserIdentifierFactory).build(),
      Math.random() < 0.5,
    ];

    describe('instantiate', () => {
      it('success', () => {
        const props = generator();

        const instance = new Criteria(...props);

        expect(instance).toBeInstanceOf(Criteria);
        expect(instance.date).toBeNullOr(props[0], (expectedDate, actualDate) =>
          expect(actualDate).toEqualValueObject(expectedDate)
        );
        expect(instance.user).toBeNullOr(props[1], (expectedUser, actualUser) =>
          expect(actualUser).toEqualValueObject(expectedUser)
        );
        expect(instance.isSubmitted).toBe(props[2]);
      });
    });

    ValueObjectTest(
      Criteria,
      generator,
      ([date, user, isSubmitted]): Array<Properties> => [
        [null, user, isSubmitted],
        [date, null, isSubmitted],
        [date, user, null],
        [null, null, null],
      ]
    );
  });
});
