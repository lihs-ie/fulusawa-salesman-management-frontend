import { Criteria } from 'domains/visit';
import { Builder } from 'tests/factories';
import { UserIdentifierFactory } from 'tests/factories/domains/user';
import { SortFactory } from 'tests/factories/domains/visit';

import { ValueObjectTest } from '../common/value-object';

describe('Package criteria', () => {
  describe('Class Criteria', () => {
    type Properties = ConstructorParameters<typeof Criteria>;

    const generator = (): Properties => [null, null];

    describe('instantiate', () => {
      it('success', () => {
        const props = generator();

        const instance = new Criteria(...props);

        expect(instance).toBeInstanceOf(Criteria);
        expect(instance.user).toBeNullOr(props[0], (expectedUser, actualUser) =>
          expect(actualUser).toEqualValueObject(expectedUser)
        );
        expect(instance.sort).toBe(props[1]);
      });

      ValueObjectTest(
        Criteria,
        generator,
        ([user, sort]): Array<Properties> => [
          [Builder.get(UserIdentifierFactory).build(), sort],
          [user, Builder.get(SortFactory).build()],
          [Builder.get(UserIdentifierFactory).build(), Builder.get(SortFactory).build()],
        ]
      );
    });
  });
});
