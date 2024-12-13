import { z } from 'zod';

import { Hydrator } from 'hydration/common';

export type Primitives = boolean | number | string | undefined | null | symbol | bigint;

export const PrimitiveHydrator = <T extends Primitives>(): Hydrator<T, T> => ({
  hydrate: (value) => value,
  dehydrate: (value) => value,
});

export const expressibleBoolSchema = z.preprocess((value) => {
  if (value === '0' || value === 'false') {
    return false;
  } else if (value === '1' || value === 'true') {
    return true;
  }

  return value;
}, z.boolean()) as z.ZodEffects<z.ZodBoolean, boolean, boolean>;

export const jsonStringSchema = <T>(schema: z.ZodType<T>) =>
  z.preprocess((value) => {
    try {
      if (typeof value !== 'string') {
        return false;
      }

      return JSON.parse(decodeURIComponent(value));
    } catch (error) {
      return false;
    }
  }, schema);
