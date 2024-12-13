import { z } from 'zod';

import { UniversallyUniqueIdentifier } from 'domains/common';
import { Hydrator } from 'hydration/common';

export const universallyUniqueIdentifierSchema = z
  .object({
    value: z.string().uuid(),
  })
  .brand('UniversallyUniqueIdentifierSchema');

export type UniversallyUniqueIdentifierPayload = z.infer<typeof universallyUniqueIdentifierSchema>;

export const UniversallyUniqueIdentifierHydrator = <
  T extends UniversallyUniqueIdentifier,
  P extends UniversallyUniqueIdentifierPayload,
>(
  concrete: new (value: string) => T
): Hydrator<T, P> => ({
  hydrate: (value) => new concrete(value.value),

  dehydrate: (value) =>
    ({
      value: value.value,
    }) as P,
});
