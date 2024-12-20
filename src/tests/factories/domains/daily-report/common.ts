import { List, OrderedMap } from 'immutable';

import { Criteria, DailyReport, DailyReportIdentifier, Repository } from 'domains/daily-report';
import { ScheduleIdentifier } from 'domains/schedule';
import { UserIdentifier } from 'domains/user';
import { VisitIdentifier } from 'domains/visit';
import { Builder, Factory } from 'tests/factories/common';

import { DateTimeRangeFactory, UniversallyUniqueIdentifierFactory } from '../common';
import { ScheduleIdentifierFactory } from '../schedule';
import { UserIdentifierFactory } from '../user';
import { VisitIdentifierFactory } from '../visit';

export class DailyReportIdentifierFactory extends UniversallyUniqueIdentifierFactory(
  DailyReportIdentifier
) {}

type DailyReportProperties = {
  identifier: DailyReportIdentifier;
  user: UserIdentifier;
  date: Date;
  schedules: List<ScheduleIdentifier>;
  visits: List<VisitIdentifier>;
  isSubmitted: boolean;
};

export class DailyReportFactory extends Factory<DailyReport, DailyReportProperties> {
  protected instantiate(properties: DailyReportProperties): DailyReport {
    return new DailyReport(
      properties.identifier,
      properties.user,
      properties.date,
      properties.schedules,
      properties.visits,
      properties.isSubmitted
    );
  }

  protected prepare(
    overrides: Partial<DailyReportProperties>,
    seed: number
  ): DailyReportProperties {
    return {
      identifier: Builder.get(DailyReportIdentifierFactory).buildWith(seed),
      user: Builder.get(UserIdentifierFactory).buildWith(seed),
      date: new Date(Math.floor(seed / 10)),
      schedules: Builder.get(ScheduleIdentifierFactory).buildListWith(
        Math.floor(Math.random() * 10) + 1,
        seed
      ),
      visits: Builder.get(VisitIdentifierFactory).buildListWith(
        Math.floor(Math.random() * 10) + 1,
        seed
      ),
      isSubmitted: Math.random() < 0.5,
      ...overrides,
    };
  }

  protected retrieve(instance: DailyReport): DailyReportProperties {
    return {
      identifier: instance.identifier,
      user: instance.user,
      date: instance.date,
      schedules: instance.schedules,
      visits: instance.visits,
      isSubmitted: instance.isSubmitted,
    };
  }
}

export type RepositoryProperties = {
  instances: List<DailyReport>;
  onPersist?: (instance: DailyReport) => void;
  onRemove?: (instances: List<DailyReport>) => void;
};

export class RepositoryFactory extends Factory<Repository, RepositoryProperties> {
  protected instantiate(properties: RepositoryProperties): Repository {
    return new (class extends Repository {
      private instances: OrderedMap<DailyReportIdentifier, DailyReport>;

      public constructor(
        instances: List<DailyReport>,
        private readonly onPersist?: (instance: DailyReport) => void,
        private readonly onRemove?: (instances: List<DailyReport>) => void
      ) {
        super();
        this.instances = instances.toOrderedMap().mapKeys((_, instance) => instance.identifier);
      }

      public async add(dailyReport: DailyReport): Promise<void> {
        if (this.instances.has(dailyReport.identifier)) {
          throw new Error('DailyReport already exists.');
        }

        this.instances = this.instances.set(dailyReport.identifier, dailyReport);

        if (this.onPersist) {
          this.onPersist(dailyReport);
        }
      }

      public async update(dailyReport: DailyReport): Promise<void> {
        if (!this.instances.has(dailyReport.identifier)) {
          throw new Error('DailyReport not found.');
        }

        this.instances = this.instances.set(dailyReport.identifier, dailyReport);

        if (this.onPersist) {
          this.onPersist(dailyReport);
        }
      }

      public async find(identifier: DailyReportIdentifier): Promise<DailyReport> {
        const dailyReport = this.instances.get(identifier);

        if (!dailyReport) {
          throw new Error('DailyReport not found.');
        }

        return dailyReport;
      }

      public async list(criteria: Criteria): Promise<List<DailyReport>> {
        return this.instances
          .filter((instance) => {
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
          })
          .toList();
      }

      public async delete(identifier: DailyReportIdentifier): Promise<void> {
        if (!this.instances.has(identifier)) {
          throw new Error('DailyReport not found.');
        }

        this.instances = this.instances.delete(identifier);

        if (this.onRemove) {
          this.onRemove(this.instances.toList());
        }
      }
    })(properties.instances, properties.onPersist, properties.onRemove);
  }

  protected prepare(overrides: Partial<RepositoryProperties>, seed: number): RepositoryProperties {
    return {
      instances: Builder.get(DailyReportFactory).buildListWith(10, seed),
      ...overrides,
    };
  }

  protected retrieve(_: Repository): RepositoryProperties {
    throw new Error('Repository cannot be retrieved.');
  }
}

expect.extend({
  toBeSameDailyReport(actual: DailyReport, expected: DailyReport) {
    try {
      expect(actual.identifier).toEqualValueObject(expected.identifier);
      expect(actual.user).toEqualValueObject(expected.user);
      expect(actual.date.toISOString()).toBe(expected.date.toISOString());

      expect(actual.schedules.count()).toBe(expected.schedules.count());
      expected.schedules.zip(actual.schedules).forEach(([expectedSchedule, actualSchedule]) => {
        expect(actualSchedule).toEqualValueObject(expectedSchedule);
      });

      expect(actual.visits.count()).toBe(expected.visits.count());
      expected.visits.zip(actual.visits).forEach(([expectedVisit, actualVisit]) => {
        expect(actualVisit).toEqualValueObject(expectedVisit);
      });

      expect(actual.isSubmitted).toBe(expected.isSubmitted);

      return {
        message: () => 'OK',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => (error as Error).message,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSameDailyReport(expected: DailyReport): R;
    }
  }
}
