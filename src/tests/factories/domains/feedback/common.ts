import { List, Map } from 'immutable';

import {
  Criteria,
  Feedback,
  FeedbackIdentifier,
  Status,
  Type,
  Repository,
  Sort,
} from 'domains/feedback';
import { Builder, EnumFactory, Factory, StringFactory } from 'tests/factories/common';

import { UniversallyUniqueIdentifierFactory } from '../common';

export class FeedbackIdentifierFactory extends UniversallyUniqueIdentifierFactory(
  FeedbackIdentifier
) {}

export const TypeFactory = EnumFactory(Type);

export const StatusFactory = EnumFactory(Status);

type FeedbackProperties = {
  identifier: FeedbackIdentifier;
  type: Type;
  status: Status;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export class FeedbackFactory extends Factory<Feedback, FeedbackProperties> {
  protected instantiate(properties: FeedbackProperties): Feedback {
    return new Feedback(
      properties.identifier,
      properties.type,
      properties.status,
      properties.content,
      properties.createdAt,
      properties.updatedAt
    );
  }

  protected prepare(overrides: Partial<FeedbackProperties>, seed: number): FeedbackProperties {
    return {
      identifier: Builder.get(FeedbackIdentifierFactory).buildWith(seed),
      type: Builder.get(TypeFactory).buildWith(seed),
      status: Builder.get(StatusFactory).buildWith(seed),
      content: Builder.get(StringFactory(1, Feedback.MAX_CONTENT_LENGTH)).buildWith(seed),
      createdAt: new Date(Math.floor(seed / 2)),
      updatedAt: new Date(Math.floor(seed / 2) + 1),
      ...overrides,
    };
  }

  protected retrieve(instance: Feedback): FeedbackProperties {
    return {
      identifier: instance.identifier,
      type: instance.type,
      status: instance.status,
      content: instance.content,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    };
  }
}

export type RepositoryProperties = {
  instances: List<Feedback>;
  onPersist?: (instance: Feedback) => void;
  onRemove?: (instances: List<Feedback>) => void;
};

export class RepositoryFactory extends Factory<Repository, RepositoryProperties> {
  protected instantiate(properties: RepositoryProperties): Repository {
    return new (class extends Repository {
      private instances: Map<FeedbackIdentifier, Feedback>;

      public constructor(
        instances: List<Feedback>,
        private readonly onPersist?: (instance: Feedback) => void,
        private readonly onRemove?: (instances: List<Feedback>) => void
      ) {
        super();

        this.instances = Map(instances.toMap().mapKeys((_, instance) => instance.identifier));
      }

      public async add(feedback: Feedback): Promise<void> {
        if (this.instances.has(feedback.identifier)) {
          throw new Error('Feedback already exists.');
        }

        this.instances = this.instances.set(feedback.identifier, feedback);

        if (this.onPersist) {
          this.onPersist(feedback);
        }
      }

      public async update(feedback: Feedback): Promise<void> {
        if (!this.instances.has(feedback.identifier)) {
          throw new Error('Feedback not found.');
        }

        this.instances = this.instances.set(feedback.identifier, feedback);

        if (this.onPersist) {
          this.onPersist(feedback);
        }
      }

      public async find(identifier: FeedbackIdentifier): Promise<Feedback> {
        const feedback = this.instances.get(identifier);

        if (!feedback) {
          throw new Error('Feedback not found.');
        }

        return feedback;
      }

      public async list(criteria: Criteria): Promise<List<Feedback>> {
        const filtered = this.instances.filter((instance) => {
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
      }

      public async delete(identifier: FeedbackIdentifier): Promise<void> {
        if (!this.instances.has(identifier)) {
          throw new Error('Feedback not found.');
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
      instances: Builder.get(FeedbackFactory).buildListWith(10, seed),
      ...overrides,
    };
  }

  protected retrieve(_: Repository): RepositoryProperties {
    throw new Error('Repository cannot be retrieved.');
  }
}

expect.extend({
  toBeSameFeedback(actual: Feedback, expected: Feedback) {
    try {
      expect(actual.identifier).toEqualValueObject(expected.identifier);
      expect(actual.type).toBe(expected.type);
      expect(actual.status).toBe(expected.status);
      expect(actual.content).toBe(expected.content);
      expect(actual.createdAt.toISOString()).toBe(expected.createdAt.toISOString());
      expect(actual.updatedAt.toISOString()).toBe(expected.updatedAt.toISOString());

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
      toBeSameFeedback(expected: Feedback): R;
    }
  }
}
