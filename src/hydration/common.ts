import { z } from 'zod';

export interface Hydrator<T, P> {
  hydrate: (value: P) => T;
  dehydrate: (value: T) => P;
  asPayload?: (raw: {}) => P;
}

export type Hydrated<T extends Hydrator<any, any>> = T extends Hydrator<infer T, any> ? T : never;
export type Payload<T extends Hydrator<any, any>> = T extends Hydrator<any, infer P> ? P : never;

export type HydratorMap<T extends object, P extends object> = {
  [K in keyof T]: Hydrator<T[K], P>;
};

export type HydratedMap<T extends HydratorMap<any, any>> = {
  [K in keyof T]: Hydrated<T[K]>;
};

export type PayloadMap<T extends HydratorMap<any, any>> = {
  [K in keyof T]: Payload<T[K]>;
};

export class CombinedHydrator<T extends HydratorMap<any, any>>
  implements Hydrator<HydratedMap<T>, PayloadMap<T>>
{
  private elements: T;

  public constructor(elements: T) {
    this.elements = elements;
  }

  public hydrate(value: PayloadMap<T>): HydratedMap<T> {
    return Object.keys(this.elements).reduce((carry, key) => {
      return {
        ...carry,
        [key]: this.elements[key].hydrate(value[key]),
      };
    }, {}) as HydratedMap<T>;
  }

  public dehydrate(value: HydratedMap<T>): PayloadMap<T> {
    return Object.keys(this.elements).reduce((carry, key) => {
      return {
        ...carry,
        [key]: this.elements[key].dehydrate(value[key]),
      };
    }, {}) as PayloadMap<T>;
  }
}

export const combineHydrator = <T extends HydratorMap<any, any>>(map: T) =>
  new CombinedHydrator<T>(map);

export const asPayload = <T extends {}, P>(value: T, schema: z.ZodType<P>): P => {
  return schema.parse(value);
};

export const OptionalHydrator = <T, P>(real: Hydrator<T, P>): Hydrator<T | null, P | null> => ({
  hydrate: (value) => {
    if (!value) {
      return null;
    }

    return real.hydrate(value);
  },

  dehydrate: (value) => {
    if (!value) {
      return null;
    }

    return real.dehydrate(value);
  },
});
