import { DateTimeRange } from 'domains/common';
import { Criteria, Status } from 'domains/schedule';
import { UserIdentifier } from 'domains/user';
import { Builder, Factory, StringFactory } from 'tests/factories/common';

import { DateTimeRangeFactory } from '../common';
import { UserIdentifierFactory } from '../user';

import { StatusFactory } from './common';

type CriteriaProperties = {
  status: Status | null;
  date: DateTimeRange | null;
  title: string | null;
  user: UserIdentifier | null;
  fulfilled?: boolean;
};

export class CriteriaFactory extends Factory<Criteria, CriteriaProperties> {
  protected instantiate(properties: CriteriaProperties): Criteria {
    return new Criteria(properties.status, properties.date, properties.title, properties.user);
  }

  protected prepare(overrides: Partial<CriteriaProperties>, seed: number): CriteriaProperties {
    if (overrides.fulfilled) {
      return {
        status: Builder.get(StatusFactory).buildWith(seed),
        date: Builder.get(DateTimeRangeFactory).buildWith(seed),
        title: Builder.get(StringFactory(1, Criteria.MAX_TITLE_LENGTH)).buildWith(seed),
        user: Builder.get(UserIdentifierFactory).buildWith(seed),
        ...overrides,
      };
    }

    return {
      status: null,
      date: null,
      title: null,
      user: null,
      ...overrides,
    };
  }

  protected retrieve(instance: Criteria): CriteriaProperties {
    return {
      status: instance.status,
      date: instance.date,
      title: instance.title,
      user: instance.user,
    };
  }
}
