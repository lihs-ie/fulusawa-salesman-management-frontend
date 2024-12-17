import { FrequencyType, RepeatFrequency } from 'domains/schedule';
import { Builder, EnumFactory, Factory } from 'tests/factories/common';

export const TypeFactory = EnumFactory(FrequencyType);

type RepeatFrequencyProperties = {
  type: FrequencyType;
  interval: number;
};

export class RepeatFrequencyFactory extends Factory<RepeatFrequency, RepeatFrequencyProperties> {
  protected instantiate(properties: RepeatFrequencyProperties): RepeatFrequency {
    return new RepeatFrequency(properties.type, properties.interval);
  }

  protected prepare(
    overrides: Partial<RepeatFrequencyProperties>,
    seed: number
  ): RepeatFrequencyProperties {
    return {
      type: Builder.get(TypeFactory).buildWith(seed),
      interval: Math.trunc(Math.random() * 10) + 1,
      ...overrides,
    };
  }

  protected retrieve(instance: RepeatFrequency): RepeatFrequencyProperties {
    return {
      type: instance.type,
      interval: instance.interval,
    };
  }
}
