import { Criteria } from 'domains/cemetery';
import { CustomerIdentifier } from 'domains/customer';
import { Builder, Factory } from 'tests/factories/common';

import { CustomerIdentifierFactory } from '../customer';

type CriteriaProperties = {
  customer: CustomerIdentifier | null;
  fulfilled?: boolean;
};

export class CriteriaFactory extends Factory<Criteria, CriteriaProperties> {
  protected instantiate(properties: CriteriaProperties): Criteria {
    return new Criteria(properties.customer);
  }

  protected prepare(overrides: Partial<CriteriaProperties>, seed: number): CriteriaProperties {
    if (overrides.fulfilled) {
      return {
        customer: Builder.get(CustomerIdentifierFactory).buildWith(seed),
        ...overrides,
      };
    }

    return {
      customer: null,
      ...overrides,
    };
  }

  protected retrieve(instance: Criteria): CriteriaProperties {
    return {
      customer: instance.customer,
    };
  }
}
