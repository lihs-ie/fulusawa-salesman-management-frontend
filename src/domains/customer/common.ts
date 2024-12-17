import { List } from 'immutable';

import { CemeteryIdentifier } from 'domains/cemetery';
import { Address, PhoneNumber, UniversallyUniqueIdentifier } from 'domains/common';
import { TransactionHistoryIdentifier } from 'domains/transaction-history';

import { Criteria } from './criteria';

export class CustomerIdentifier extends UniversallyUniqueIdentifier {
  public constructor(value: string) {
    super(value);
  }
}
export class Customer {
  public static readonly MAX_LAST_NAME_LENGTH = 255;

  public static readonly MAX_FIRST_NAME_LENGTH = 255;

  public constructor(
    public readonly identifier: CustomerIdentifier,
    public readonly lastName: string,
    public readonly firstName: string | null,
    public readonly address: Address,
    public readonly phone: PhoneNumber,
    public readonly cemeteries: List<CemeteryIdentifier>,
    public readonly transactionHistories: List<TransactionHistoryIdentifier>
  ) {
    if (lastName === '' || Customer.MAX_LAST_NAME_LENGTH < lastName.length) {
      throw new Error(`Last name must be 1 to ${Customer.MAX_LAST_NAME_LENGTH} characters.`);
    }

    if (
      firstName !== null &&
      (firstName === '' || Customer.MAX_FIRST_NAME_LENGTH < firstName.length)
    ) {
      throw new Error(`First name must be 1 to ${Customer.MAX_FIRST_NAME_LENGTH} characters.`);
    }
  }
}

export abstract class Repository {
  public abstract add(customer: Customer): Promise<void>;

  public abstract update(customer: Customer): Promise<void>;

  public abstract find(identifier: CustomerIdentifier): Promise<Customer>;

  public abstract list(criteria: Criteria): Promise<List<Customer>>;

  public abstract delete(identifier: CustomerIdentifier): Promise<void>;
}
