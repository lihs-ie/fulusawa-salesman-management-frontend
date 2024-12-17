import { DateTimeRange } from 'domains/common';
import { Criteria } from 'domains/daily-report';
import { UserIdentifier } from 'domains/user';
import { Builder, Factory } from 'tests/factories/common';

import { DateTimeRangeFactory } from '../common';
import { UserIdentifierFactory } from '../user';

type CriteriaProperties = {
  date: DateTimeRange | null;
  user: UserIdentifier | null;
  isSubmitted: boolean | null;
  fulfilled?: boolean;
};

export class CriteriaFactory extends Factory<Criteria, CriteriaProperties> {
  protected instantiate(properties: CriteriaProperties): Criteria {
    return new Criteria(properties.date, properties.user, properties.isSubmitted);
  }

  protected prepare(overrides: Partial<CriteriaProperties>, seed: number): CriteriaProperties {
    if (overrides.fulfilled) {
      return {
        date: Builder.get(DateTimeRangeFactory).buildWith(seed),
        user: Builder.get(UserIdentifierFactory).buildWith(seed),
        isSubmitted: Math.random() < 0.5,
        ...overrides,
      };
    }

    return {
      date: null,
      user: null,
      isSubmitted: null,
      ...overrides,
    };
  }

  protected retrieve(instance: Criteria): CriteriaProperties {
    return {
      date: instance.date,
      user: instance.user,
      isSubmitted: instance.isSubmitted,
    };
  }
}
