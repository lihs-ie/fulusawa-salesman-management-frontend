import { List, Map } from 'immutable';

import { Address, PhoneNumber } from 'domains/common';
import { UserIdentifier } from 'domains/user';
import { Criteria, Repository, Result, Sort, Visit, VisitIdentifier } from 'domains/visit';
import { Builder, EnumFactory, Factory } from 'tests/factories/common';

import { AddressFactory, UniversallyUniqueIdentifierFactory } from '../common';
import { UserIdentifierFactory } from '../user';

export class VisitIdentifierFactory extends UniversallyUniqueIdentifierFactory(VisitIdentifier) {}

export const ResultFactory = EnumFactory(Result);

type VisitProperties = {
  identifier: VisitIdentifier;
  user: UserIdentifier;
  visitedAt: Date;
  address: Address;
  phone: PhoneNumber | null;
  hasGraveyard: boolean;
  note: string | null;
  result: Result;
};

export class VisitFactory extends Factory<Visit, VisitProperties> {
  protected instantiate(properties: VisitProperties): Visit {
    return new Visit(
      properties.identifier,
      properties.user,
      properties.visitedAt,
      properties.address,
      properties.phone,
      properties.hasGraveyard,
      properties.note,
      properties.result
    );
  }

  protected prepare(overrides: Partial<VisitProperties>, seed: number): VisitProperties {
    return {
      identifier: Builder.get(VisitIdentifierFactory).buildWith(seed),
      user: Builder.get(UserIdentifierFactory).buildWith(seed),
      visitedAt: new Date(seed),
      address: Builder.get(AddressFactory).buildWith(seed),
      phone: null,
      hasGraveyard: Math.random() < 0.5,
      note: null,
      result: Builder.get(ResultFactory).buildWith(seed),
      ...overrides,
    };
  }

  protected retrieve(instance: Visit): VisitProperties {
    return {
      identifier: instance.identifier,
      user: instance.user,
      visitedAt: instance.visitedAt,
      address: instance.address,
      phone: instance.phone,
      hasGraveyard: instance.hasGraveyard,
      note: instance.note,
      result: instance.result,
    };
  }
}

type RepositoryProperties = {
  instances: List<Visit>;
};

export class RepositoryFactory extends Factory<Repository, RepositoryProperties> {
  protected instantiate(properties: RepositoryProperties): Repository {
    return new (class extends Repository {
      private instances: Map<VisitIdentifier, Visit>;

      public constructor(instances: List<Visit>) {
        super();

        this.instances = instances.toMap().mapKeys((_, instance) => instance.identifier);
      }

      public async add(visit: Visit): Promise<void> {
        if (this.instances.has(visit.identifier)) {
          throw new Error('Visit already exists');
        }

        this.instances = this.instances.set(visit.identifier, visit);
      }

      public async update(visit: Visit): Promise<void> {
        if (!this.instances.has(visit.identifier)) {
          throw new Error('Visit not found');
        }

        this.instances = this.instances.set(visit.identifier, visit);
      }

      public async find(identifier: VisitIdentifier): Promise<Visit> {
        const visit = this.instances.get(identifier);

        if (!visit) {
          throw new Error('Visit not found');
        }

        return visit;
      }

      public async list(criteria: Criteria): Promise<List<Visit>> {
        const filtered = this.instances.filter((instance) => {
          if (criteria.user && !criteria.user.equals(instance.user)) {
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
              case Sort.VISITED_AT_ASC:
                return instance.visitedAt;

              case Sort.VISITED_AT_DESC:
                return -instance.visitedAt;

              default:
                throw new Error('Invalid sort.');
            }
          })
          .toList();
      }

      public async delete(identifier: VisitIdentifier): Promise<void> {
        if (!this.instances.has(identifier)) {
          throw new Error('Visit not found');
        }

        this.instances = this.instances.remove(identifier);
      }
    })(properties.instances);
  }

  protected prepare(overrides: Partial<RepositoryProperties>, seed: number): RepositoryProperties {
    return {
      instances: Builder.get(VisitFactory).buildListWith(Math.floor(Math.random() * 10) + 1, seed),
      ...overrides,
    };
  }

  protected retrieve(_: Repository): RepositoryProperties {
    throw new Error('Repository cannot be retrieved');
  }
}
