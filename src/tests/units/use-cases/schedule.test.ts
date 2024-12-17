import { List } from 'immutable';
import { v7 as uuid } from 'uuid';

import { Criteria, Schedule as Entity, Repository } from 'domains/schedule';
import { ScheduleHydrator } from 'hydration/schedule';
import { Builder, StringFactory } from 'tests/factories';
import { DateTimeRangeFactory } from 'tests/factories/domains/common';
import {
  CriteriaFactory,
  ScheduleFactory,
  RepositoryFactory,
  RepositoryProperties,
  StatusFactory,
} from 'tests/factories/domains/schedule';
import { UserIdentifierFactory } from 'tests/factories/domains/user';
import { Schedule, Conditions } from 'use-cases/schedule';

import { createPersistUseCase, createRemoveUseCase } from './helper';

describe('Package schedule', () => {
  describe('Class Schedule', () => {
    describe('instantiate', () => {
      it('success', () => {
        const useCase = new Schedule(Builder.get(RepositoryFactory).build());

        expect(useCase).toBeInstanceOf(Schedule);
      });
    });

    describe('add', () => {
      it('successfully persist schedule.', async () => {
        const [useCase, persisted] = createPersistUseCase<
          Schedule,
          Entity,
          Repository,
          RepositoryProperties
        >(Schedule, RepositoryFactory, List());

        const expected = Builder.get(ScheduleFactory).build();

        await useCase.add(ScheduleHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameSchedule(expected);
      });

      it('unsuccessfully with existing schedule.', async () => {
        const instances = Builder.get(ScheduleFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<Schedule, Entity, Repository, RepositoryProperties>(
          Schedule,
          RepositoryFactory,
          instances
        );

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await expect(useCase.add(ScheduleHydrator.dehydrate(target!))).rejects.toThrow();
      });
    });

    describe('update', () => {
      it('successfully update schedule.', async () => {
        const instances = Builder.get(ScheduleFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, persisted] = createPersistUseCase<
          Schedule,
          Entity,
          Repository,
          RepositoryProperties
        >(Schedule, RepositoryFactory, instances);
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const expected = Builder.get(ScheduleFactory).build({ identifier: target!.identifier });

        await useCase.update(ScheduleHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameSchedule(expected);
      });

      it('unsuccessfully with missing schedule.', async () => {
        const [useCase] = createPersistUseCase<Schedule, Entity, Repository, RepositoryProperties>(
          Schedule,
          RepositoryFactory
        );

        const target = Builder.get(ScheduleFactory).build();

        await expect(useCase.update(ScheduleHydrator.dehydrate(target))).rejects.toThrow();
      });
    });

    describe('find', () => {
      it('successfully return schedule.', async () => {
        const instances = Builder.get(ScheduleFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<Schedule, Entity, Repository, RepositoryProperties>(
          Schedule,
          RepositoryFactory,
          instances
        );
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const actual = await useCase.find(target!.identifier.value);

        expect(actual).toBeSameSchedule(target!);
      });

      it('unsuccessfully with missing schedule.', async () => {
        const [useCase] = createPersistUseCase<Schedule, Entity, Repository, RepositoryProperties>(
          Schedule,
          RepositoryFactory
        );

        await expect(useCase.find(uuid())).rejects.toThrow();
      });
    });

    describe('list', () => {
      const createConditions = (criteria: Criteria): Conditions => ({
        status: criteria.status ?? undefined,
        dateStart: criteria.date?.min?.toISOString(),
        dateEnd: criteria.date?.max?.toISOString(),
        title: criteria.title ?? undefined,
        user: criteria.user?.value ?? undefined,
      });

      const createExpecteds = (criteria: Criteria, instances: List<Entity>): List<Entity> => {
        return instances.filter((instance) => {
          if (criteria.status && criteria.status === instance.status) {
            return false;
          }

          if (criteria.date && !criteria.date.includes(instance.date)) {
            return false;
          }

          if (criteria.title && !instance.content.title.includes(criteria.title)) {
            return false;
          }

          if (criteria.user) {
            const user = criteria.user;

            const isParticipate = instance.participants.every((participant) =>
              user.equals(participant)
            );

            const isCreator = user.equals(instance.creator);
            const isUpdater = user.equals(instance.updater);

            if (!isParticipate && !isCreator && !isUpdater) {
              return false;
            }
          }

          return true;
        });
      };

      it.each<Criteria>([
        Builder.get(CriteriaFactory).build(),
        Builder.get(CriteriaFactory).build({
          status: Builder.get(StatusFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          date: Builder.get(DateTimeRangeFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          title: Builder.get(StringFactory(1, Criteria.MAX_TITLE_LENGTH)).build(),
        }),
        Builder.get(CriteriaFactory).build({
          user: Builder.get(UserIdentifierFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          fulfilled: true,
        }),
      ])(`successfully return schedules with conditions %s.`, async (criteria) => {
        const instances = Builder.get(ScheduleFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const expecteds = createExpecteds(criteria, instances);

        const [useCase] = createPersistUseCase<Schedule, Entity, Repository, RepositoryProperties>(
          Schedule,
          RepositoryFactory,
          instances
        );

        const actuals = await useCase.list(createConditions(criteria));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameSchedule(expected);
        });
      });
    });

    describe('delete', () => {
      it('successfully remove schedule.', async () => {
        const instances = Builder.get(ScheduleFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, removed] = createRemoveUseCase<
          Schedule,
          Entity,
          Repository,
          RepositoryProperties
        >(Schedule, RepositoryFactory, instances);

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await useCase.delete(target!.identifier.value);

        removed.current.forEach((instance) => {
          expect(instance).not.toBeSameSchedule(target!);
        });
      });

      it('unsuccessfully with missing schedule.', async () => {
        const [useCase] = createRemoveUseCase<Schedule, Entity, Repository, RepositoryProperties>(
          Schedule,
          RepositoryFactory
        );

        await expect(useCase.delete(uuid())).rejects.toThrow();
      });
    });
  });
});
