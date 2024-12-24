import { List } from 'immutable';
import { injectable } from 'inversify';

import { Adaptor } from 'acl/fsm-backend/transaction-history/templates';
import {
  Criteria,
  Repository,
  TransactionHistory,
  TransactionHistoryIdentifier,
} from 'domains/transaction-history';

@injectable()
export class ACLTransactionHistoryRepository implements Repository {
  public constructor(public readonly adaptor: Adaptor) {}

  public async add(transactionHistory: TransactionHistory): Promise<void> {
    return await this.adaptor.add(transactionHistory);
  }

  public async update(transactionHistory: TransactionHistory): Promise<void> {
    return await this.adaptor.update(transactionHistory);
  }

  public async find(identifier: TransactionHistoryIdentifier): Promise<TransactionHistory> {
    return await this.adaptor.find(identifier);
  }

  public async list(criteria: Criteria): Promise<List<TransactionHistory>> {
    return await this.adaptor.list(criteria);
  }

  public async delete(identifier: TransactionHistoryIdentifier): Promise<void> {
    return await this.adaptor.delete(identifier);
  }
}
