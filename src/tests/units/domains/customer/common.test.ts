import { Customer, CustomerIdentifier } from 'domains/customer';
import { Builder, StringFactory } from 'tests/factories';
import { CemeteryIdentifierFactory } from 'tests/factories/domains/cemetery';
import { AddressFactory } from 'tests/factories/domains/common';
import { PhoneNumberFactory } from 'tests/factories/domains/common/contact';
import { CustomerIdentifierFactory } from 'tests/factories/domains/customer';
import { TransactionHistoryIdentifierFactory } from 'tests/factories/domains/transaction-history';

import { UniversallyUniqueIdentifierTest } from '../common/identifier';

describe('Package common', () => {
  describe('Class CustomerIdentifier', () => {
    UniversallyUniqueIdentifierTest(CustomerIdentifier);
  });

  describe('Class Customer', () => {
    type Properties = ConstructorParameters<typeof Customer>;

    const generator = (): Properties => [
      Builder.get(CustomerIdentifierFactory).build(),
      Builder.get(StringFactory(1, Customer.MAX_LAST_NAME_LENGTH)).build(),
      null,
      Builder.get(AddressFactory).build(),
      Builder.get(PhoneNumberFactory).build(),
      Builder.get(CemeteryIdentifierFactory).buildList(3),
      Builder.get(TransactionHistoryIdentifierFactory).buildList(3),
    ];

    describe('instantiate', () => {
      it('success.', () => {
        const props = generator();

        const instance = new Customer(...props);

        expect(instance).toBeInstanceOf(Customer);
        expect(props[0].equals(instance.identifier)).toBeTruthy();
        expect(props[1]).toBe(instance.lastName);
        expect(props[2]).toBe(instance.firstName);
        expect(props[3].equals(instance.address)).toBeTruthy();
        expect(props[4].equals(instance.phone)).toBeTruthy();
        expect(props[5].equals(instance.cemeteries)).toBeTruthy();
        expect(props[6].equals(instance.transactionHistories)).toBeTruthy();
      });

      it.each([
        { lastName: '' },
        { lastName: 'a'.padEnd(Customer.MAX_LAST_NAME_LENGTH + 1, 'a') },
        { firstName: '' },
        { firstName: 'a'.padEnd(Customer.MAX_FIRST_NAME_LENGTH + 1, 'a') },
      ])('fails with invalid value %s', (invalid) => {
        const valids = generator();

        const values = {
          identifier: valids[0],
          lastName: valids[1],
          firstName: valids[2],
          address: valids[3],
          phone: valids[4],
          cemeteries: valids[5],
          transactionHistories: valids[6],
          ...invalid,
        };

        expect(
          () =>
            new Customer(
              values.identifier,
              values.lastName,
              values.firstName,
              values.address,
              values.phone,
              values.cemeteries,
              values.transactionHistories
            )
        ).toThrow();
      });
    });
  });
});
