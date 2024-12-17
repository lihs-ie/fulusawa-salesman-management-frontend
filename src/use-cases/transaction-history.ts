import { List } from 'immutable';
import { injectable } from 'inversify';

import { CustomerIdentifier } from 'domains/customer';
import {
  Repository,
  TransactionHistory as Entity,
  TransactionHistoryIdentifier,
  Sort,
  Criteria,
} from 'domains/transaction-history';
import { UserIdentifier } from 'domains/user';
import {
  TransactionHistoryHydrator,
  TransactionHistoryPayload,
} from 'hydration/transaction-history';

export type Conditions = Partial<{
  user: string;
  customer: string;
  sort: Sort;
}>;

@injectable()
export class TransactionHistory {
  public constructor(private readonly repository: Repository) {}

  public async add(payload: TransactionHistoryPayload): Promise<void> {
    const transactionHistory = TransactionHistoryHydrator.hydrate(payload);

    await this.repository.add(transactionHistory);
  }

  public async update(payload: TransactionHistoryPayload): Promise<void> {
    const transactionHistory = TransactionHistoryHydrator.hydrate(payload);

    await this.repository.update(transactionHistory);
  }

  public async find(identifier: string): Promise<Entity> {
    return this.repository.find(new TransactionHistoryIdentifier(identifier));
  }

  public async list(conditions: Conditions): Promise<List<Entity>> {
    return this.repository.list(this.createCriteria(conditions));
  }

  public async delete(identifier: string): Promise<void> {
    await this.repository.delete(new TransactionHistoryIdentifier(identifier));
  }

  private createCriteria(conditions: Conditions): Criteria {
    return new Criteria(
      this.extractUser(conditions),
      this.extractCustomer(conditions),
      conditions.sort ?? null
    );
  }

  private extractUser(conditions: Conditions): UserIdentifier | null {
    return conditions.user ? new UserIdentifier(conditions.user) : null;
  }

  private extractCustomer(conditions: Conditions): CustomerIdentifier | null {
    return conditions.customer ? new CustomerIdentifier(conditions.customer) : null;
  }
}
