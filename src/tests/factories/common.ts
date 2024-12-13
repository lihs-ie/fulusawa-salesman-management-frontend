import { Range, List, Set, isSet } from 'immutable';

import { scramble } from 'aspects/math';
import { ClassMethodNames } from 'aspects/type';
import { Range as RangeModel } from 'domains/common/range';

export abstract class Factory<T, P extends {}> {
  public create(overrides: Partial<P>, seed: number): T {
    return this.instantiate(this.prepare(overrides, seed));
  }

  public duplicate(instance: T, overrides: Partial<P>): T {
    return this.instantiate({
      ...this.retrieve(instance),
      ...overrides,
    });
  }

  protected abstract instantiate(properties: P): T;

  protected abstract prepare(overrides: Partial<P>, seed: number): P;

  protected abstract retrieve(instance: T): P;
}

export class Builder<T, P extends {}> {
  public static get<U, Q extends {}>(initializer: new () => Factory<U, Q>): Builder<U, Q> {
    return new Builder(new initializer());
  }

  private seeds: Set<number> = Set();

  private constructor(private readonly factory: Factory<T, P>) {}

  public build(overrides: Partial<P> = {}): T {
    return this.factory.create(overrides, this.nextSeed());
  }

  public buildList(size: number, overrides: Partial<P> = {}): List<T> {
    return this.nextSeeds(size).map((seed) => this.factory.create(overrides, seed));
  }

  public buildWith(seed: number, overrides: Partial<P> = {}): T {
    return this.factory.create(overrides, seed);
  }

  public buildListWith(size: number, seed: number, overrides: Partial<P> = {}): List<T> {
    return Range(0, size)
      .toList()
      .map((index) => this.buildWith(seed + index, overrides));
  }

  public duplicate(instance: T, overrides: Partial<P> = {}): T {
    return this.factory.duplicate(instance, overrides);
  }

  private nextSeed(): number {
    return this.nextSeeds(1).first() as number;
  }

  private nextSeeds(size: number): List<number> {
    const seeds = Range(0, this.seeds.size + size)
      .toList()
      .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
      .filter((candidate) => !this.seeds.has(candidate));

    seeds.forEach((seed) => {
      this.seeds.add(seed);
    });

    return seeds;
  }
}

export const EnumFactory = <T extends object>(choices: T) => {
  type Choice = T[keyof T];
  type Properties = { value: Choice; exclusion?: Choice | Set<Choice> };

  const candidates = Set<Choice>(Object.values(choices));

  const determineExclusions = (exclusions?: Choice | Set<Choice>): Set<Choice> => {
    return exclusions === undefined ? Set() : isSet(exclusions) ? exclusions : Set([exclusions]);
  };

  return class extends Factory<Choice, Properties> {
    protected instantiate(properties: Properties): Choice {
      return properties.value;
    }

    protected prepare(overrides: Partial<Properties>, seed: number): Properties {
      const exclusions = determineExclusions(overrides.exclusion);

      const actuals = candidates.subtract(exclusions).toList();

      if (actuals.isEmpty()) {
        throw new Error('Candidates does not exist.');
      }

      return { value: actuals.get(seed % actuals.count())!, ...overrides };
    }

    protected retrieve(instance: Choice): Properties {
      return {
        value: instance,
      };
    }
  };
};

export const RangeFactory = <T extends RangeModel<U>, U>(
  target: new (min: U | null, max: U | null) => T
) => {
  type Properties = {
    min: U | null;
    max: U | null;
  };

  abstract class Boilerplate extends Factory<T, Properties> {
    protected instantiate(properties: Properties): T {
      return new target(properties.min, properties.max);
    }

    protected retrieve(instance: T): Properties {
      return {
        min: instance.min,
        max: instance.max,
      };
    }
  }

  return Boilerplate;
};

export type ModelOf<T extends Factory<any, any>> = T extends Factory<infer M, any> ? M : never;

export type PropertiesOf<T extends Factory<any, any>> = T extends Factory<any, infer P> ? P : never;

type StringProperties = {
  value: string;
};

export const StringFactory = (
  min?: number | null,
  max?: number | null,
  candidates?: Set<string>
) => {
  const minLength = min ?? 1;
  const maxLength = max ?? 255;
  const characters = (candidates ?? Characters.ALPHANUMERIC).toList();

  return class extends Factory<string, StringProperties> {
    protected instantiate(properties: StringProperties): string {
      return properties.value;
    }

    protected prepare(overrides: Partial<StringProperties>, seed: number): StringProperties {
      const offset = seed % (maxLength - minLength + 1);
      const length = minLength + offset;

      const value = Range(0, length)
        .toList()
        .map((index) => {
          return characters.get(scramble(seed + index) % characters.size);
        })
        .join('');

      return { value, ...overrides };
    }

    protected retrieve(instance: string): StringProperties {
      return {
        value: instance,
      };
    }
  };
};

export const Characters = {
  ALPHANUMERIC: Set([
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
  ]),
  ALPHA: Set([
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ]),
  NUMERIC: Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']),
  SYMBOL: Set([
    '!',
    '"',
    '#',
    '$',
    '%',
    '&',
    "'",
    '(',
    ')',
    '*',
    '+',
    ',',
    '-',
    '.',
    '/',
    ':',
    ';',
    '<',
    '=',
    '>',
    '?',
    '@',
    '[',
    '\\',
    ']',
    '^',
    '_',
    '`',
    '{',
    ' |',
    '}',
    '~',
  ]),
};

export type Spyed<T> = T & {
  spys: {
    [key in ClassMethodNames<T>]: jest.SpyInstance;
  };
};
