import { Criteria } from 'domains/transaction-history';
import { Builder } from 'tests/factories';
import { CustomerIdentifierFactory } from 'tests/factories/domains/customer';
import { SortFactory } from 'tests/factories/domains/transaction-history';
import { UserIdentifierFactory } from 'tests/factories/domains/user';

describe('Package criteria', () => {
  describe('Class Criteria', () => {
    type Properties = ConstructorParameters<typeof Criteria>;

    const generator = (): Properties => [
      Builder.get(UserIdentifierFactory).build(),
      Builder.get(CustomerIdentifierFactory).build(),
      Builder.get(SortFactory).build(),
    ];

    describe('instantiate', () => {
      it('success', () => {
        const props = generator();

        const instance = new Criteria(...props);

        expect(instance).toBeInstanceOf(Criteria);
        expect(instance.user).toBeNullOr(props[0], (expectedUser, actualUser) =>
          expect(actualUser).toEqualValueObject(expectedUser)
        );
        expect(instance.customer).toBeNullOr(props[1], (expectedCustomer, actualCustomer) =>
          expect(actualCustomer).toEqualValueObject(expectedCustomer)
        );
        expect(instance.sort).toBe(props[2]);
      });
    });
  });
});
