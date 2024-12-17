import { Criteria, Status, Type, Sort } from 'domains/feedback';
import { Builder, EnumFactory, Factory } from 'tests/factories/common';

import { StatusFactory, TypeFactory } from './common';

export const SortFactory = EnumFactory(Sort);

type Properties = {
  type: Type | null;
  status: Status | null;
  sort: Sort | null;
  fulfilled?: boolean;
};

export class CriteriaFactory extends Factory<Criteria, Properties> {
  protected instantiate(properties: Properties): Criteria {
    return new Criteria(properties.type, properties.status, properties.sort);
  }

  protected prepare(overrides: Partial<Properties>, seed: number): Properties {
    if (overrides.fulfilled) {
      return {
        type: Builder.get(TypeFactory).buildWith(seed),
        status: Builder.get(StatusFactory).buildWith(seed),
        sort: Builder.get(SortFactory).buildWith(seed),
        ...overrides,
      };
    }

    return {
      type: null,
      status: null,
      sort: null,
      ...overrides,
    };
  }

  protected retrieve(instance: Criteria): Properties {
    return {
      type: instance.type,
      status: instance.status,
      sort: instance.sort,
    };
  }
}
