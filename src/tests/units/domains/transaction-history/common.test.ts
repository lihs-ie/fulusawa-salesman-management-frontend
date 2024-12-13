import { TransactionHistory, TransactionHistoryIdentifier } from 'domains/transaction-history';
import { Builder } from 'tests/factories';
import { CustomerIdentifierFactory } from 'tests/factories/domains/customer';
import {
  TransactionHistoryIdentifierFactory,
  TypeFactory,
} from 'tests/factories/domains/transaction-history';
import { UserIdentifierFactory } from 'tests/factories/domains/user';

import { UniversallyUniqueIdentifierTest } from '../common/identifier';

describe('Package common', () => {
  describe('Class TransactionHistoryIdentifier', () => {
    UniversallyUniqueIdentifierTest(TransactionHistoryIdentifier);
  });

  describe('Class TransactionHistory', () => {
    describe('instantiate', () => {
      type Properties = ConstructorParameters<typeof TransactionHistory>;

      const generator = (): Properties => [
        Builder.get(TransactionHistoryIdentifierFactory).build(),
        Builder.get(CustomerIdentifierFactory).build(),
        Builder.get(UserIdentifierFactory).build(),
        Builder.get(TypeFactory).build(),
        null,
        new Date(),
      ];

      it('success', () => {
        const props = generator();

        const instance = new TransactionHistory(...props);

        expect(instance).toBeInstanceOf(TransactionHistory);
        expect(instance.identifier).toEqualValueObject(props[0]);
        expect(instance.customer).toEqualValueObject(props[1]);
        expect(instance.user).toEqualValueObject(props[2]);
        expect(instance.type).toBe(props[3]);
        expect(instance.description).toBe(props[4]);
        expect(instance.date).toBe(props[5]);
      });

      it.each([
        { description: '' },
        { description: 'a'.repeat(TransactionHistory.MAX_DESCRIPTION_LENGTH + 1) },
      ])('fails with invalid values when %p', (invalid) => {
        const valids = generator();

        const props = {
          identifier: valids[0],
          customer: valids[1],
          user: valids[2],
          type: valids[3],
          description: invalid.description,
          date: valids[5],
        };

        expect(
          () =>
            new TransactionHistory(
              props.identifier,
              props.customer,
              props.user,
              props.type,
              props.description,
              props.date
            )
        ).toThrow();
      });
    });
  });
});
