import { List } from 'immutable';
import { v7 as uuid } from 'uuid';

import {
  Criteria,
  TransactionHistory as Entity,
  Repository,
  Sort,
} from 'domains/transaction-history';
import { TransactionHistoryHydrator } from 'hydration/transaction-history';
import { Builder } from 'tests/factories';
import { CustomerIdentifierFactory } from 'tests/factories/domains/customer';
import {
  CriteriaFactory,
  TransactionHistoryFactory,
  RepositoryFactory,
  RepositoryProperties,
  SortFactory,
} from 'tests/factories/domains/transaction-history';
import { UserIdentifierFactory } from 'tests/factories/domains/user';
import { TransactionHistory, Conditions } from 'use-cases/transaction-history';

import { createPersistUseCase, createRemoveUseCase } from './helper';

describe('Package transaction-history', () => {
  describe('Class TransactionHistory', () => {
    describe('instantiate', () => {
      it('success', () => {
        const useCase = new TransactionHistory(Builder.get(RepositoryFactory).build());

        expect(useCase).toBeInstanceOf(TransactionHistory);
      });
    });

    describe('add', () => {
      it('successfully persist transaction-history.', async () => {
        const [useCase, persisted] = createPersistUseCase<
          TransactionHistory,
          Entity,
          Repository,
          RepositoryProperties
        >(TransactionHistory, RepositoryFactory, List());

        const expected = Builder.get(TransactionHistoryFactory).build();

        await useCase.add(TransactionHistoryHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameTransactionHistory(expected);
      });

      it('unsuccessfully with existing transaction-history.', async () => {
        const instances = Builder.get(TransactionHistoryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<
          TransactionHistory,
          Entity,
          Repository,
          RepositoryProperties
        >(TransactionHistory, RepositoryFactory, instances);

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await expect(useCase.add(TransactionHistoryHydrator.dehydrate(target!))).rejects.toThrow();
      });
    });

    describe('update', () => {
      it('successfully update transaction-history.', async () => {
        const instances = Builder.get(TransactionHistoryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, persisted] = createPersistUseCase<
          TransactionHistory,
          Entity,
          Repository,
          RepositoryProperties
        >(TransactionHistory, RepositoryFactory, instances);
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const expected = Builder.get(TransactionHistoryFactory).build({
          identifier: target!.identifier,
        });

        await useCase.update(TransactionHistoryHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameTransactionHistory(expected);
      });

      it('unsuccessfully with missing transaction-history.', async () => {
        const [useCase] = createPersistUseCase<
          TransactionHistory,
          Entity,
          Repository,
          RepositoryProperties
        >(TransactionHistory, RepositoryFactory);

        const target = Builder.get(TransactionHistoryFactory).build();

        await expect(
          useCase.update(TransactionHistoryHydrator.dehydrate(target))
        ).rejects.toThrow();
      });
    });

    describe('find', () => {
      it('successfully return transaction-history.', async () => {
        const instances = Builder.get(TransactionHistoryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<
          TransactionHistory,
          Entity,
          Repository,
          RepositoryProperties
        >(TransactionHistory, RepositoryFactory, instances);
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const actual = await useCase.find(target!.identifier.value);

        expect(actual).toBeSameTransactionHistory(target!);
      });

      it('unsuccessfully with missing transaction-history.', async () => {
        const [useCase] = createPersistUseCase<
          TransactionHistory,
          Entity,
          Repository,
          RepositoryProperties
        >(TransactionHistory, RepositoryFactory);

        await expect(useCase.find(uuid())).rejects.toThrow();
      });
    });

    describe('list', () => {
      const createConditions = (criteria: Criteria): Conditions => ({
        user: criteria.user?.value,
        customer: criteria.customer?.value,
        sort: criteria.sort ?? undefined,
      });

      const createExpecteds = (criteria: Criteria, instances: List<Entity>): List<Entity> => {
        const filtered = instances.filter((instance) => {
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
      };

      it.each<Criteria>([
        Builder.get(CriteriaFactory).build(),
        Builder.get(CriteriaFactory).build({
          customer: Builder.get(CustomerIdentifierFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          sort: Builder.get(SortFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          user: Builder.get(UserIdentifierFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          fulfilled: true,
        }),
      ])(`successfully return transaction-histories with conditions %s.`, async (criteria) => {
        const instances = Builder.get(TransactionHistoryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const expecteds = createExpecteds(criteria, instances);

        const [useCase] = createPersistUseCase<
          TransactionHistory,
          Entity,
          Repository,
          RepositoryProperties
        >(TransactionHistory, RepositoryFactory, instances);

        const actuals = await useCase.list(createConditions(criteria));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameTransactionHistory(expected);
        });
      });
    });

    describe('delete', () => {
      it('successfully remove transaction-history.', async () => {
        const instances = Builder.get(TransactionHistoryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, removed] = createRemoveUseCase<
          TransactionHistory,
          Entity,
          Repository,
          RepositoryProperties
        >(TransactionHistory, RepositoryFactory, instances);

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await useCase.delete(target!.identifier.value);

        removed.current.forEach((instance) => {
          expect(instance).not.toBeSameTransactionHistory(target!);
        });
      });

      it('unsuccessfully with missing transaction-history.', async () => {
        const [useCase] = createRemoveUseCase<
          TransactionHistory,
          Entity,
          Repository,
          RepositoryProperties
        >(TransactionHistory, RepositoryFactory);

        await expect(useCase.delete(uuid())).rejects.toThrow();
      });
    });
  });
});
