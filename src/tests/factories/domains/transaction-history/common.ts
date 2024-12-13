import { List, Map } from 'immutable';

import { CustomerIdentifier } from 'domains/customer';
import {
  Criteria,
  Repository,
  Sort,
  TransactionHistory,
  TransactionHistoryIdentifier,
  Type,
} from 'domains/transaction-history';
import { UserIdentifier } from 'domains/user';
import { Builder, EnumFactory, Factory } from 'tests/factories/common';

import { UniversallyUniqueIdentifierFactory } from '../common';
import { CustomerIdentifierFactory } from '../customer';
import { UserIdentifierFactory } from '../user';

export class TransactionHistoryIdentifierFactory extends UniversallyUniqueIdentifierFactory(
  TransactionHistoryIdentifier
) {}

export const TypeFactory = EnumFactory(Type);

type TransactionHistoryProperties = {
  identifier: TransactionHistoryIdentifier;
  customer: CustomerIdentifier;
  user: UserIdentifier;
  type: Type;
  description: string | null;
  date: Date;
};

export class TransactionHistoryFactory extends Factory<
  TransactionHistory,
  TransactionHistoryProperties
> {
  protected instantiate(properties: TransactionHistoryProperties): TransactionHistory {
    return new TransactionHistory(
      properties.identifier,
      properties.customer,
      properties.user,
      properties.type,
      properties.description,
      properties.date
    );
  }

  protected prepare(
    overrides: Partial<TransactionHistoryProperties>,
    seed: number
  ): TransactionHistoryProperties {
    return {
      identifier: Builder.get(TransactionHistoryIdentifierFactory).buildWith(seed),
      customer: Builder.get(CustomerIdentifierFactory).buildWith(seed),
      user: Builder.get(UserIdentifierFactory).buildWith(seed),
      type: Builder.get(TypeFactory).build(),
      description: null,
      date: new Date(seed),
      ...overrides,
    };
  }

  protected retrieve(instance: TransactionHistory): TransactionHistoryProperties {
    return {
      identifier: instance.identifier,
      customer: instance.customer,
      user: instance.user,
      type: instance.type,
      description: instance.description,
      date: instance.date,
    };
  }
}

type RepositoryProperties = {
  instances: List<TransactionHistory>;
};

export class RepositoryFactory extends Factory<Repository, RepositoryProperties> {
  protected instantiate(properties: RepositoryProperties): Repository {
    return new (class extends Repository {
      private instances: Map<TransactionHistoryIdentifier, TransactionHistory>;

      public constructor(instances: List<TransactionHistory>) {
        super();

        this.instances = instances.toMap().mapKeys((_, instance) => instance.identifier);
      }

      public async add(transactionHistory: TransactionHistory): Promise<void> {
        if (this.instances.has(transactionHistory.identifier)) {
          throw new Error('Transaction history already exists.');
        }

        this.instances = this.instances.set(transactionHistory.identifier, transactionHistory);
      }

      public async update(transactionHistory: TransactionHistory): Promise<void> {
        if (!this.instances.has(transactionHistory.identifier)) {
          throw new Error('Transaction history not found.');
        }

        this.instances = this.instances.set(transactionHistory.identifier, transactionHistory);
      }

      public async find(identifier: TransactionHistoryIdentifier): Promise<TransactionHistory> {
        const instance = this.instances.get(identifier);

        if (!instance) {
          throw new Error('Transaction history not found.');
        }

        return instance;
      }

      public async list(criteria: Criteria): Promise<List<TransactionHistory>> {
        const filtered = this.instances.filter((instance) => {
          if (criteria.user && !criteria.user.equals(instance.user)) {
            return false;
          }

          if (criteria.customer && !criteria.customer.equals(instance.customer)) {
            return false;
          }

          return true;
        });

        if (!criteria.sort) {
          return filtered.toList();
        }

        return filtered
          .sortBy((instance) => {
            switch (criteria.sort) {
              case Sort.CREATED_AT_ASC:
                return instance.date.getTime();
              case Sort.CREATED_AT_DESC:
                return -instance.date.getTime();
              case Sort.UPDATED_AT_ASC:
                return instance.date.getTime();
              case Sort.UPDATED_AT_DESC:
                return -instance.date.getTime();
              default:
                throw new Error('Invalid sort.');
            }
          })
          .toList();
      }

      public async delete(identifier: TransactionHistoryIdentifier): Promise<void> {
        if (!this.instances.has(identifier)) {
          throw new Error('Transaction history not found.');
        }

        this.instances = this.instances.remove(identifier);
      }
    })(properties.instances);
  }

  protected prepare(overrides: Partial<RepositoryProperties>, seed: number): RepositoryProperties {
    return {
      instances: Builder.get(TransactionHistoryFactory).buildListWith(10, seed),
      ...overrides,
    };
  }

  protected retrieve(instance: Repository): RepositoryProperties {
    throw new Error('Repository cannot be retrieved.');
  }
}
