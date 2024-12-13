import { DateTimeRange } from 'domains/common/date';
import { RangeFactory } from 'tests/factories/common';

type Properties = {
  min: Date | null;
  max: Date | null;
};

export class DateTimeRangeFactory extends RangeFactory(DateTimeRange) {
  protected instantiate(properties: Properties): DateTimeRange {
    return new DateTimeRange(properties.min, properties.max);
  }

  protected prepare(overrides: Partial<Properties>, seed: number): Properties {
    const offset = Math.trunc(seed % 100000000);

    return {
      min: new Date(offset),
      max: new Date(offset + 86400000),
      ...overrides,
    };
  }
}
