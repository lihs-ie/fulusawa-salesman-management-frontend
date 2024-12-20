import { List } from 'immutable';
import { v7 as uuid } from 'uuid';

import { Criteria, DailyReport as Entity, Repository } from 'domains/daily-report';
import { DailyReportHydrator } from 'hydration/daily-report';
import { Builder } from 'tests/factories';
import { DateTimeRangeFactory } from 'tests/factories/domains/common';
import {
  CriteriaFactory,
  DailyReportFactory,
  RepositoryFactory,
  RepositoryProperties,
} from 'tests/factories/domains/daily-report';
import { UserIdentifierFactory } from 'tests/factories/domains/user';
import { DailyReport, Conditions } from 'use-cases/daily-report';

import { createPersistUseCase, createRemoveUseCase } from './helper';

describe('Package daily-report', () => {
  describe('Class DailyReport', () => {
    describe('instantiate', () => {
      it('success', () => {
        const useCase = new DailyReport(Builder.get(RepositoryFactory).build());

        expect(useCase).toBeInstanceOf(DailyReport);
      });
    });

    describe('add', () => {
      it('successfully persist daily-report.', async () => {
        const [useCase, persisted] = createPersistUseCase<
          DailyReport,
          Entity,
          Repository,
          RepositoryProperties
        >(DailyReport, RepositoryFactory, List());

        const expected = Builder.get(DailyReportFactory).build();

        await useCase.add(DailyReportHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameDailyReport(expected);
      });

      it('unsuccessfully with existing daily-report.', async () => {
        const instances = Builder.get(DailyReportFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<
          DailyReport,
          Entity,
          Repository,
          RepositoryProperties
        >(DailyReport, RepositoryFactory, instances);

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await expect(useCase.add(DailyReportHydrator.dehydrate(target!))).rejects.toThrow();
      });
    });

    describe('update', () => {
      it('successfully update daily-report.', async () => {
        const instances = Builder.get(DailyReportFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, persisted] = createPersistUseCase<
          DailyReport,
          Entity,
          Repository,
          RepositoryProperties
        >(DailyReport, RepositoryFactory, instances);
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const expected = Builder.get(DailyReportFactory).build({ identifier: target!.identifier });

        await useCase.update(DailyReportHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameDailyReport(expected);
      });

      it('unsuccessfully with missing daily-report.', async () => {
        const [useCase] = createPersistUseCase<
          DailyReport,
          Entity,
          Repository,
          RepositoryProperties
        >(DailyReport, RepositoryFactory);

        const target = Builder.get(DailyReportFactory).build();

        await expect(useCase.update(DailyReportHydrator.dehydrate(target))).rejects.toThrow();
      });
    });

    describe('find', () => {
      it('successfully return daily-report.', async () => {
        const instances = Builder.get(DailyReportFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<
          DailyReport,
          Entity,
          Repository,
          RepositoryProperties
        >(DailyReport, RepositoryFactory, instances);
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const actual = await useCase.find(target!.identifier.value);

        expect(actual).toBeSameDailyReport(target!);
      });

      it('unsuccessfully with missing daily-report.', async () => {
        const [useCase] = createPersistUseCase<
          DailyReport,
          Entity,
          Repository,
          RepositoryProperties
        >(DailyReport, RepositoryFactory);

        await expect(useCase.find(uuid())).rejects.toThrow();
      });
    });

    describe('list', () => {
      const createConditions = (criteria: Criteria): Conditions => ({
        dateStart: criteria.date?.min?.toISOString() ?? undefined,
        dateEnd: criteria.date?.max?.toISOString() ?? undefined,
        user: criteria.user?.value ?? undefined,
        isSubmitted: criteria.isSubmitted === null ? undefined : criteria.isSubmitted,
      });

      const createExpecteds = (criteria: Criteria, instances: List<Entity>): List<Entity> => {
        return instances.filter((instance) => {
          if (criteria.user && criteria.user.equals(instance.user)) {
            return false;
          }

          if (criteria.isSubmitted && criteria.isSubmitted !== instance.isSubmitted) {
            return false;
          }

          if (criteria.date) {
            const min = instance.date;
            min.setHours(0, 0, 0, 0);

            const max = instance.date;
            max.setHours(23, 59, 59, 999);

            const comparand = Builder.get(DateTimeRangeFactory).build({ min, max });

            if (!criteria.date.includes(comparand)) {
              return false;
            }
          }

          return true;
        });
      };

      it.each<Criteria>([
        Builder.get(CriteriaFactory).build(),
        Builder.get(CriteriaFactory).build({
          date: Builder.get(DateTimeRangeFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          user: Builder.get(UserIdentifierFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          isSubmitted: Math.random() < 0.5,
        }),
        Builder.get(CriteriaFactory).build({ fulfilled: true }),
      ])(`successfully return daily-reports with conditions %s.`, async (criteria) => {
        const instances = Builder.get(DailyReportFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const expecteds = createExpecteds(criteria, instances);

        const [useCase] = createPersistUseCase<
          DailyReport,
          Entity,
          Repository,
          RepositoryProperties
        >(DailyReport, RepositoryFactory, instances);

        const actuals = await useCase.list(createConditions(criteria));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameDailyReport(expected);
        });
      });
    });

    describe('delete', () => {
      it('successfully remove daily-report.', async () => {
        const instances = Builder.get(DailyReportFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, removed] = createRemoveUseCase<
          DailyReport,
          Entity,
          Repository,
          RepositoryProperties
        >(DailyReport, RepositoryFactory, instances);

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await useCase.delete(target!.identifier.value);

        removed.current.forEach((instance) => {
          expect(instance).not.toBeSameDailyReport(target!);
        });
      });

      it('unsuccessfully with missing daily-report.', async () => {
        const [useCase] = createRemoveUseCase<
          DailyReport,
          Entity,
          Repository,
          RepositoryProperties
        >(DailyReport, RepositoryFactory);

        await expect(useCase.delete(uuid())).rejects.toThrow();
      });
    });
  });
});
