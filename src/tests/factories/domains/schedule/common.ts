import { List, Map, Set } from 'immutable';

import { DateTimeRange } from 'domains/common';
import { CustomerIdentifier } from 'domains/customer';
import {
  Content,
  Criteria,
  RepeatFrequency,
  Repository,
  Schedule,
  ScheduleIdentifier,
  Status,
} from 'domains/schedule';
import { UserIdentifier } from 'domains/user';
import { Builder, EnumFactory, Factory, StringFactory } from 'tests/factories/common';

import { DateTimeRangeFactory, UniversallyUniqueIdentifierFactory } from '../common';
import { UserIdentifierFactory } from '../user';

export class ScheduleIdentifierFactory extends UniversallyUniqueIdentifierFactory(
  ScheduleIdentifier
) {}

export const StatusFactory = EnumFactory(Status);

type ContentProperties = {
  title: string;
  description: string | null;
};

export class ContentFactory extends Factory<Content, ContentProperties> {
  protected instantiate(properties: ContentProperties): Content {
    return new Content(properties.title, properties.description);
  }

  protected prepare(overrides: Partial<ContentProperties>, seed: number): ContentProperties {
    return {
      title: Builder.get(StringFactory(1, Content.MAX_TITLE_LENGTH)).buildWith(seed),
      description: null,
      ...overrides,
    };
  }

  protected retrieve(instance: Content): ContentProperties {
    return {
      title: instance.title,
      description: instance.description,
    };
  }
}

type ScheduleProperties = {
  identifier: ScheduleIdentifier;
  participants: Set<UserIdentifier>;
  creator: UserIdentifier;
  updater: UserIdentifier;
  customer: CustomerIdentifier | null;
  content: Content;
  date: DateTimeRange;
  status: Status;
  repeat: RepeatFrequency | null;
};

export class ScheduleFactory extends Factory<Schedule, ScheduleProperties> {
  protected instantiate(properties: ScheduleProperties): Schedule {
    return new Schedule(
      properties.identifier,
      properties.participants,
      properties.creator,
      properties.updater,
      properties.customer,
      properties.content,
      properties.date,
      properties.status,
      properties.repeat
    );
  }

  protected prepare(overrides: Partial<ScheduleProperties>, seed: number): ScheduleProperties {
    return {
      identifier: Builder.get(ScheduleIdentifierFactory).buildWith(seed),
      participants: Builder.get(UserIdentifierFactory)
        .buildListWith(seed, Math.floor(Math.random() * Schedule.MAX_PARTICIPANTS) + 1)
        .toSet(),
      creator: Builder.get(UserIdentifierFactory).buildWith(seed),
      updater: Builder.get(UserIdentifierFactory).buildWith(seed),
      customer: null,
      content: Builder.get(ContentFactory).buildWith(seed),
      date: Builder.get(DateTimeRangeFactory).buildWith(seed),
      status: Builder.get(StatusFactory).buildWith(seed),
      repeat: null,
      ...overrides,
    };
  }

  protected retrieve(instance: Schedule): ScheduleProperties {
    return {
      identifier: instance.identifier,
      participants: instance.participants,
      creator: instance.creator,
      updater: instance.updater,
      customer: instance.customer,
      content: instance.content,
      date: instance.date,
      status: instance.status,
      repeat: instance.repeat,
    };
  }
}

type RepositoryProperties = {
  instances: List<Schedule>;
};

export class RepositoryFactory extends Factory<Repository, RepositoryProperties> {
  protected instantiate(properties: RepositoryProperties): Repository {
    return new (class extends Repository {
      private instances: Map<ScheduleIdentifier, Schedule>;

      public constructor(instances: List<Schedule>) {
        super();

        this.instances = instances.toMap().mapKeys((_, instance) => instance.identifier);
      }

      public async add(schedule: Schedule): Promise<void> {
        if (this.instances.has(schedule.identifier)) {
          throw new Error('Schedule already exists.');
        }

        this.instances = this.instances.set(schedule.identifier, schedule);
      }

      public async update(schedule: Schedule): Promise<void> {
        if (!this.instances.has(schedule.identifier)) {
          throw new Error('Schedule not found.');
        }

        this.instances = this.instances.set(schedule.identifier, schedule);
      }

      public async find(identifier: ScheduleIdentifier): Promise<Schedule> {
        const instance = this.instances.get(identifier);

        if (!instance) {
          throw new Error('Schedule not found.');
        }

        return instance;
      }

      public async list(criteria: Criteria): Promise<List<Schedule>> {
        return this.instances
          .filter((instance) => {
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
          })
          .toList();
      }

      public async delete(identifier: ScheduleIdentifier): Promise<void> {
        if (!this.instances.has(identifier)) {
          throw new Error('Schedule not found.');
        }

        this.instances = this.instances.delete(identifier);
      }
    })(properties.instances);
  }

  protected prepare(overrides: Partial<RepositoryProperties>, seed: number): RepositoryProperties {
    return {
      instances: Builder.get(ScheduleFactory).buildListWith(seed, 10),
      ...overrides,
    };
  }

  protected retrieve(_: Repository): RepositoryProperties {
    throw new Error('Repository cannot be retrieved.');
  }
}

expect.extend({
  toBeSameSchedule(actual: Schedule, expected: Schedule) {
    try {
      expect(actual.identifier).toEqualValueObject(expected.identifier);
      expect(actual.participants.equals(expected.participants)).toBeTruthy();
      expect(actual.creator).toEqualValueObject(expected.creator);
      expect(actual.updater).toEqualValueObject(expected.updater);
      expect(actual.customer).toBeNullOr(expected.customer, (expectedCustomer, actualCustomer) =>
        expect(expectedCustomer.equals(actualCustomer)).toBeTruthy()
      );
      expect(actual.content).toEqualValueObject(expected.content);
      expect(actual.date).toEqualValueObject(expected.date);
      expect(actual.status).toBe(expected.status);
      expect(actual.repeat).toBeNullOr(expected.repeat, (expectedRepeat, actualRepeat) =>
        expect(expectedRepeat).toEqualValueObject(actualRepeat)
      );

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
      toBeSameSchedule(expected: Schedule): R;
    }
  }
}
