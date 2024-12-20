import { List } from 'immutable';
import { v7 as uuid } from 'uuid';

import { Criteria, Feedback as Entity, Repository, Sort } from 'domains/feedback';
import { FeedbackHydrator } from 'hydration/feedback';
import { Builder } from 'tests/factories';
import {
  CriteriaFactory,
  FeedbackFactory,
  RepositoryFactory,
  RepositoryProperties,
  SortFactory,
  StatusFactory,
  TypeFactory,
} from 'tests/factories/domains/feedback';
import { Feedback, Conditions } from 'use-cases/feedback';

import { createPersistUseCase, createRemoveUseCase } from './helper';

describe('Package feedback', () => {
  describe('Class Feedback', () => {
    describe('instantiate', () => {
      it('success', () => {
        const useCase = new Feedback(Builder.get(RepositoryFactory).build());

        expect(useCase).toBeInstanceOf(Feedback);
      });
    });

    describe('add', () => {
      it('successfully persist feedback.', async () => {
        const [useCase, persisted] = createPersistUseCase<
          Feedback,
          Entity,
          Repository,
          RepositoryProperties
        >(Feedback, RepositoryFactory, List());

        const expected = Builder.get(FeedbackFactory).build();

        await useCase.add(FeedbackHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameFeedback(expected);
      });

      it('unsuccessfully with existing feedback.', async () => {
        const instances = Builder.get(FeedbackFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<Feedback, Entity, Repository, RepositoryProperties>(
          Feedback,
          RepositoryFactory,
          instances
        );

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await expect(useCase.add(FeedbackHydrator.dehydrate(target!))).rejects.toThrow();
      });
    });

    describe('update', () => {
      it('successfully update feedback.', async () => {
        const instances = Builder.get(FeedbackFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, persisted] = createPersistUseCase<
          Feedback,
          Entity,
          Repository,
          RepositoryProperties
        >(Feedback, RepositoryFactory, instances);
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const expected = Builder.get(FeedbackFactory).build({ identifier: target!.identifier });

        await useCase.update(FeedbackHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameFeedback(expected);
      });

      it('unsuccessfully with missing feedback.', async () => {
        const [useCase] = createPersistUseCase<Feedback, Entity, Repository, RepositoryProperties>(
          Feedback,
          RepositoryFactory
        );

        const target = Builder.get(FeedbackFactory).build();

        await expect(useCase.update(FeedbackHydrator.dehydrate(target))).rejects.toThrow();
      });
    });

    describe('find', () => {
      it('successfully return feedback.', async () => {
        const instances = Builder.get(FeedbackFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<Feedback, Entity, Repository, RepositoryProperties>(
          Feedback,
          RepositoryFactory,
          instances
        );
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const actual = await useCase.find(target!.identifier.value);

        expect(actual).toBeSameFeedback(target!);
      });

      it('unsuccessfully with missing feedback.', async () => {
        const [useCase] = createPersistUseCase<Feedback, Entity, Repository, RepositoryProperties>(
          Feedback,
          RepositoryFactory
        );

        await expect(useCase.find(uuid())).rejects.toThrow();
      });
    });

    describe('list', () => {
      const createConditions = (criteria: Criteria): Conditions => ({
        type: criteria.type ?? undefined,
        status: criteria.status ?? undefined,
        sort: criteria.sort ?? undefined,
      });

      const createExpecteds = (criteria: Criteria, instances: List<Entity>): List<Entity> => {
        const filtered = instances.filter((instance) => {
          if (criteria.type && instance.type !== criteria.type) {
            return false;
          }

          if (criteria.status && instance.status !== criteria.status) {
            return false;
          }

          return true;
        });

        const sort = criteria.sort;

        if (!sort) {
          return filtered.toList();
        }

        return filtered
          .sortBy((instance) => {
            switch (sort) {
              case Sort.CREATED_AT_ASC:
                return instance.createdAt;
              case Sort.CREATED_AT_DESC:
                return -instance.createdAt;
              case Sort.UPDATED_AT_ASC:
                return instance.updatedAt;
              case Sort.UPDATED_AT_DESC:
                return -instance.updatedAt;
              default:
                throw new Error(`Invalid sort: ${sort}`);
            }
          })
          .toList();
      };

      it.each<Criteria>([
        Builder.get(CriteriaFactory).build(),
        Builder.get(CriteriaFactory).build({
          type: Builder.get(TypeFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          status: Builder.get(StatusFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          sort: Builder.get(SortFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({ fulfilled: true }),
      ])(`successfully return feedbacks with conditions %s.`, async (criteria) => {
        const instances = Builder.get(FeedbackFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const expecteds = createExpecteds(criteria, instances);

        const [useCase] = createPersistUseCase<Feedback, Entity, Repository, RepositoryProperties>(
          Feedback,
          RepositoryFactory,
          instances
        );

        const actuals = await useCase.list(createConditions(criteria));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameFeedback(expected);
        });
      });
    });

    describe('delete', () => {
      it('successfully remove feedback.', async () => {
        const instances = Builder.get(FeedbackFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, removed] = createRemoveUseCase<
          Feedback,
          Entity,
          Repository,
          RepositoryProperties
        >(Feedback, RepositoryFactory, instances);

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await useCase.delete(target!.identifier.value);

        removed.current.forEach((instance) => {
          expect(instance).not.toBeSameFeedback(target!);
        });
      });

      it('unsuccessfully with missing feedback.', async () => {
        const [useCase] = createRemoveUseCase<Feedback, Entity, Repository, RepositoryProperties>(
          Feedback,
          RepositoryFactory
        );

        await expect(useCase.delete(uuid())).rejects.toThrow();
      });
    });
  });
});
