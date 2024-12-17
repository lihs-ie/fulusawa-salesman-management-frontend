import { List, OrderedMap } from 'immutable';

import { Cemetery, CemeteryIdentifier, CemeteryType, Criteria, Repository } from 'domains/cemetery';
import { CustomerIdentifier } from 'domains/customer';
import { Builder, EnumFactory, Factory, StringFactory } from 'tests/factories/common';

import { UniversallyUniqueIdentifierFactory } from '../common';
import { CustomerIdentifierFactory } from '../customer';

export class CemeteryIdentifierFactory extends UniversallyUniqueIdentifierFactory(
  CemeteryIdentifier
) {}

export const CemeteryTypeFactory = EnumFactory(CemeteryType);

type CemeteryProperties = {
  identifier: CemeteryIdentifier;
  customer: CustomerIdentifier;
  name: string;
  type: CemeteryType;
  construction: Date;
  inHouse: boolean;
};

export class CemeteryFactory extends Factory<Cemetery, CemeteryProperties> {
  protected instantiate(properties: CemeteryProperties): Cemetery {
    return new Cemetery(
      properties.identifier,
      properties.customer,
      properties.name,
      properties.type,
      properties.construction,
      properties.inHouse
    );
  }

  protected prepare(overrides: Partial<CemeteryProperties>, seed: number): CemeteryProperties {
    return {
      identifier: Builder.get(CemeteryIdentifierFactory).buildWith(seed),
      customer: Builder.get(CustomerIdentifierFactory).buildWith(seed),
      name: Builder.get(StringFactory(1, Cemetery.MAX_NAME_LENGTH)).buildWith(seed),
      type: Builder.get(CemeteryTypeFactory).buildWith(seed),
      construction: new Date(),
      inHouse: seed % 2 === 0,
      ...overrides,
    };
  }

  protected retrieve(instance: Cemetery): CemeteryProperties {
    return {
      identifier: instance.identifier,
      customer: instance.customer,
      name: instance.name,
      type: instance.type,
      construction: instance.construction,
      inHouse: instance.inHouse,
    };
  }
}

export type RepositoryProperties = {
  instances: List<Cemetery>;
  onPersist?: (cemetery: Cemetery) => void;
  onRemove?: (cemeteries: List<Cemetery>) => void;
};

export class RepositoryFactory extends Factory<Repository, RepositoryProperties> {
  protected instantiate(properties: RepositoryProperties): Repository {
    return new (class extends Repository {
      private instances: OrderedMap<CemeteryIdentifier, Cemetery>;

      public constructor(
        instances: List<Cemetery>,
        private readonly onPersist?: (cemetery: Cemetery) => void,
        private readonly onRemove?: (cemeteries: List<Cemetery>) => void
      ) {
        super();

        this.instances = instances.toOrderedMap().mapKeys((_, instance) => instance.identifier);
        this.onPersist = onPersist;
      }

      public add(cemetery: Cemetery): Promise<void> {
        if (this.instances.has(cemetery.identifier)) {
          throw new Error('Cemetery already exists.');
        }

        if (this.onPersist) {
          this.onPersist(cemetery);
        }

        this.instances = this.instances.set(cemetery.identifier, cemetery);

        return Promise.resolve();
      }

      public update(cemetery: Cemetery): Promise<void> {
        if (!this.instances.has(cemetery.identifier)) {
          throw new Error('Cemetery not found.');
        }

        this.instances = this.instances.set(cemetery.identifier, cemetery);

        if (this.onPersist) {
          this.onPersist(cemetery);
        }

        return Promise.resolve();
      }

      public find(identifier: CemeteryIdentifier): Promise<Cemetery> {
        const target = this.instances.get(identifier, null);

        if (!target) {
          throw new Error('Cemetery not found.');
        }

        return Promise.resolve(target);
      }

      public list(criteria: Criteria): Promise<List<Cemetery>> {
        const filtered = this.instances.filter((instance) => {
          if (criteria.customer && !criteria.customer.equals(instance.customer)) {
            return false;
          }

          return true;
        });

        return Promise.resolve(filtered.toList());
      }

      public delete(identifier: CemeteryIdentifier): Promise<void> {
        if (!this.instances.has(identifier)) {
          throw new Error('Cemetery not found.');
        }

        this.instances = this.instances.delete(identifier);

        if (this.onRemove) {
          this.onRemove(this.instances.toList());
        }

        return Promise.resolve();
      }
    })(properties.instances, properties.onPersist, properties.onRemove);
  }

  protected prepare(overrides: Partial<RepositoryProperties>, seed: number): RepositoryProperties {
    return {
      instances: Builder.get(CemeteryFactory).buildListWith(10, seed),
      ...overrides,
    };
  }

  protected retrieve(_: Repository): RepositoryProperties {
    throw new Error('Repository cannot be retrieved.');
  }
}

expect.extend({
  toBeSameCemetery(actual: Cemetery, expected: Cemetery) {
    try {
      expect(expected.identifier.equals(actual.identifier)).toBeTruthy();
      expect(expected.customer.equals(actual.customer)).toBeTruthy();
      expect(expected.name).toBe(actual.name);
      expect(expected.type).toBe(actual.type);
      expect(expected.construction).toBe(actual.construction);
      expect(expected.inHouse).toBe(actual.inHouse);

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
      toBeSameCemetery(a: Cemetery): R;
    }
  }
}
