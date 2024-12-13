import { CustomerIdentifier } from 'domains/customer';
import { Criteria, Sort } from 'domains/transaction-history';
import { UserIdentifier } from 'domains/user';
import { Builder, EnumFactory, Factory } from 'tests/factories/common';

import { CustomerIdentifierFactory } from '../customer';
import { UserIdentifierFactory } from '../user';

export const SortFactory = EnumFactory(Sort);

type CriteriaProperties = {
  user: UserIdentifier | null;
  customer: CustomerIdentifier | null;
  sort: Sort | null;
  fulfilled?: boolean;
};

export class CriteriaFactory extends Factory<Criteria, CriteriaProperties> {
  protected instantiate(properties: CriteriaProperties): Criteria {
    return new Criteria(properties.user, properties.customer, properties.sort);
  }

  protected prepare(overrides: Partial<CriteriaProperties>, seed: number): CriteriaProperties {
    if (overrides.fulfilled) {
      return {
        user: Builder.get(UserIdentifierFactory).buildWith(seed),
        customer: Builder.get(CustomerIdentifierFactory).buildWith(seed),
        sort: Builder.get(SortFactory).build(),
        ...overrides,
      };
    }

    return {
      user: null,
      customer: null,
      sort: null,
      ...overrides,
    };
  }

  protected retrieve(instance: Criteria): CriteriaProperties {
    return {
      user: instance.user,
      customer: instance.customer,
      sort: instance.sort,
    };
  }
}
