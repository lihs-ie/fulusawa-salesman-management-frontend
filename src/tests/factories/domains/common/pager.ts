import { Pager } from 'domains/common/pager';
import { Factory } from 'tests/factories/common';

type Properties = {
  total: number;
  items: number;
  current: number;
};

export class PagerFactory extends Factory<Pager, Properties> {
  protected instantiate(properties: Properties): Pager {
    return new Pager(properties.total, properties.items, properties.current);
  }

  protected prepare(overrides: Partial<Properties>, seed: number): Properties {
    const total = Math.trunc(seed % 1000);
    const items = Math.trunc(seed % 10) + 1;
    const current = Math.ceil(total / items);

    return {
      total: total,
      items: items,
      current: current,
      ...overrides,
    };
  }

  protected retrieve(instance: Pager): Properties {
    return {
      total: instance.total,
      items: instance.items,
      current: instance.current,
    };
  }
}
