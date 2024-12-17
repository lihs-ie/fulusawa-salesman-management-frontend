import { UserIdentifier } from 'domains/user';
import { Criteria, Sort } from 'domains/visit';
import { Builder, EnumFactory, Factory } from 'tests/factories/common';

import { UserIdentifierFactory } from '../user';

export const SortFactory = EnumFactory(Sort);

type CriteriaProperties = {
  user: UserIdentifier | null;
  sort: Sort | null;
  fulfilled?: boolean;
};

export class CriteriaFactory extends Factory<Criteria, CriteriaProperties> {
  protected instantiate(properties: CriteriaProperties): Criteria {
    return new Criteria(properties.user, properties.sort);
  }

  protected prepare(overrides: Partial<CriteriaProperties>, seed: number): CriteriaProperties {
    if (overrides.fulfilled) {
      return {
        user: Builder.get(UserIdentifierFactory).buildWith(seed),
        sort: Builder.get(SortFactory).build(),
        ...overrides,
      };
    }

    return {
      user: null,
      sort: null,
      ...overrides,
    };
  }

  protected retrieve(instance: Criteria): CriteriaProperties {
    return {
      user: instance.user,
      sort: instance.sort,
    };
  }
}
