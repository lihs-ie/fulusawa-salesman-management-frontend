import { z } from 'zod';

export const addRecursion = <B extends z.ZodObject<any>, F extends object>(base: B, field: F) => {
  const key = Object.keys(field)[0] || null;

  if (!key) {
    throw new Error('The field must have at least one key.');
  }

  type Combined = z.infer<typeof base> & {
    [key in keyof F]: Array<Combined>;
  };

  const combinedSchema: z.ZodType<Combined> = base.extend({
    [key]: z.lazy(() => z.array(combinedSchema)),
  }) as z.ZodType<Combined>;

  return combinedSchema;
};

export const addNullableRecursion = <B extends z.ZodObject<any>, F extends object>(
  base: B,
  field: F
) => {
  const key = Object.keys(field)[0] || null;

  if (!key) {
    throw new Error('The field must have at least one key.');
  }

  type Combined = z.infer<typeof base> & {
    [key in keyof F]: Array<Combined> | null;
  };

  const combinedSchema: z.ZodType<Combined> = base.extend({
    [key]: z.lazy(() => z.array(combinedSchema)).nullable(),
  }) as z.ZodType<Combined>;

  return combinedSchema;
};

export const enumSchema = <T extends z.EnumLike>(target: T) => {
  return z.preprocess((value) => {
    if (typeof value !== 'string') {
      return false;
    }

    try {
      return JSON.parse(value);
    } catch (_) {
      return value;
    }
  }, z.nativeEnum(target)) as z.ZodEffects<
    z.ZodType<T[keyof T], z.ZodTypeDef, T[keyof T]>,
    T[keyof T],
    T[keyof T]
  >;
};
