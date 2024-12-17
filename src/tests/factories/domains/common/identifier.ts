import { v7 as uuid } from 'uuid';

import { UniversallyUniqueIdentifier } from 'domains/common';
import { Factory } from 'tests/factories/common';

type UniversallyUniqueIdentifierProperties = {
  value: string;
};

export const UniversallyUniqueIdentifierFactory = <T extends UniversallyUniqueIdentifier>(
  target: new (value: string, ...args: any[]) => T
) => {
  abstract class Boilerplate extends Factory<T, UniversallyUniqueIdentifierProperties> {
    protected instantiate(properties: UniversallyUniqueIdentifierProperties): T {
      return new target(properties.value);
    }

    protected prepare(
      overrides: Partial<UniversallyUniqueIdentifierProperties>,
      seed: number
    ): UniversallyUniqueIdentifierProperties {
      return {
        value: uuid(undefined, undefined, seed),
        ...overrides,
      };
    }

    protected retrieve(instance: T): UniversallyUniqueIdentifierProperties {
      return {
        value: instance.value,
      };
    }
  }

  return Boilerplate;
};
