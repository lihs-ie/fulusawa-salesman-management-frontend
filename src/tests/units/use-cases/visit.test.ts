import { List } from 'immutable';
import { v7 as uuid } from 'uuid';

import { Criteria, Visit as Entity, Repository, Sort } from 'domains/visit';
import { VisitHydrator } from 'hydration/visit';
import { Builder } from 'tests/factories';
import { UserIdentifierFactory } from 'tests/factories/domains/user';
import {
  CriteriaFactory,
  VisitFactory,
  RepositoryFactory,
  RepositoryProperties,
  SortFactory,
} from 'tests/factories/domains/visit';
import { Visit, Conditions } from 'use-cases/visit';

import { createPersistUseCase, createRemoveUseCase } from './helper';

describe('Package visit', () => {
  describe('Class Visit', () => {
    describe('instantiate', () => {
      it('success', () => {
        const useCase = new Visit(Builder.get(RepositoryFactory).build());

        expect(useCase).toBeInstanceOf(Visit);
      });
    });

    describe('add', () => {
      it('successfully persist visit.', async () => {
        const [useCase, persisted] = createPersistUseCase<
          Visit,
          Entity,
          Repository,
          RepositoryProperties
        >(Visit, RepositoryFactory, List());

        const expected = Builder.get(VisitFactory).build();

        await useCase.add(VisitHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameVisit(expected);
      });

      it('unsuccessfully with existing visit.', async () => {
        const instances = Builder.get(VisitFactory).buildList(Math.floor(Math.random() * 10) + 1);

        const [useCase] = createPersistUseCase<Visit, Entity, Repository, RepositoryProperties>(
          Visit,
          RepositoryFactory,
          instances
        );

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await expect(useCase.add(VisitHydrator.dehydrate(target!))).rejects.toThrow();
      });
    });

    describe('update', () => {
      it('successfully update visit.', async () => {
        const instances = Builder.get(VisitFactory).buildList(Math.floor(Math.random() * 10) + 1);

        const [useCase, persisted] = createPersistUseCase<
          Visit,
          Entity,
          Repository,
          RepositoryProperties
        >(Visit, RepositoryFactory, instances);
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const expected = Builder.get(VisitFactory).build({ identifier: target!.identifier });

        await useCase.update(VisitHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameVisit(expected);
      });

      it('unsuccessfully with missing visit.', async () => {
        const [useCase] = createPersistUseCase<Visit, Entity, Repository, RepositoryProperties>(
          Visit,
          RepositoryFactory
        );

        const target = Builder.get(VisitFactory).build();

        await expect(useCase.update(VisitHydrator.dehydrate(target))).rejects.toThrow();
      });
    });

    describe('find', () => {
      it('successfully return visit.', async () => {
        const instances = Builder.get(VisitFactory).buildList(Math.floor(Math.random() * 10) + 1);

        const [useCase] = createPersistUseCase<Visit, Entity, Repository, RepositoryProperties>(
          Visit,
          RepositoryFactory,
          instances
        );
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const actual = await useCase.find(target!.identifier.value);

        expect(actual).toBeSameVisit(target!);
      });

      it('unsuccessfully with missing visit.', async () => {
        const [useCase] = createPersistUseCase<Visit, Entity, Repository, RepositoryProperties>(
          Visit,
          RepositoryFactory
        );

        await expect(useCase.find(uuid())).rejects.toThrow();
      });
    });

    describe('list', () => {
      const createConditions = (criteria: Criteria): Conditions => ({
        user: criteria.user?.value,
        sort: criteria.sort ?? undefined,
      });

      const createExpecteds = (criteria: Criteria, instances: List<Entity>): List<Entity> => {
        const filtered = instances.filter((instance) => {
          if (criteria.user && !criteria.user.equals(instance.user)) {
            return false;
          }

          return true;
        });

        if (!criteria.sort) {
          return filtered;
        }

        return filtered.sortBy((instance) => {
          switch (criteria.sort) {
            case Sort.VISITED_AT_ASC:
              return instance.visitedAt;

            case Sort.VISITED_AT_DESC:
              return -instance.visitedAt;

            default:
              throw new Error('Invalid sort.');
          }
        });
      };

      it.each<Criteria>([
        Builder.get(CriteriaFactory).build(),
        Builder.get(CriteriaFactory).build({
          user: Builder.get(UserIdentifierFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          sort: Builder.get(SortFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          fulfilled: true,
        }),
      ])(`successfully return visits with conditions %s.`, async (criteria) => {
        const instances = Builder.get(VisitFactory).buildList(Math.floor(Math.random() * 10) + 1);

        const expecteds = createExpecteds(criteria, instances);

        const [useCase] = createPersistUseCase<Visit, Entity, Repository, RepositoryProperties>(
          Visit,
          RepositoryFactory,
          instances
        );

        const actuals = await useCase.list(createConditions(criteria));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameVisit(expected);
        });
      });
    });

    describe('delete', () => {
      it('successfully remove visit.', async () => {
        const instances = Builder.get(VisitFactory).buildList(Math.floor(Math.random() * 10) + 1);

        const [useCase, removed] = createRemoveUseCase<
          Visit,
          Entity,
          Repository,
          RepositoryProperties
        >(Visit, RepositoryFactory, instances);

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await useCase.delete(target!.identifier.value);

        removed.current.forEach((instance) => {
          expect(instance).not.toBeSameVisit(target!);
        });
      });

      it('unsuccessfully with missing visit.', async () => {
        const [useCase] = createRemoveUseCase<Visit, Entity, Repository, RepositoryProperties>(
          Visit,
          RepositoryFactory
        );

        await expect(useCase.delete(uuid())).rejects.toThrow();
      });
    });
  });
});
