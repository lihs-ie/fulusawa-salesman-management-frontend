import { z } from 'zod';

import { URL } from 'domains/common/url';
import { MapHydrator } from 'hydration/collection';
import { Hydrator, asPayload } from 'hydration/common';

import { expressibleBoolSchema, PrimitiveHydrator } from './primitive';

export const URLSchema = z
  .object({
    value: z.string(),
    isRelative: expressibleBoolSchema,
  })
  .brand('URLSchema');

export type URLPayload = z.infer<typeof URLSchema>;

export const URLHydrator: Hydrator<URL, URLPayload> = {
  hydrate: (value) => new URL(value.value, value.isRelative),

  dehydrate: (value) =>
    ({
      value: value.value,
      isRelative: value.isRelative,
    }) as URLPayload,

  asPayload: (value) => asPayload(value, URLSchema),
};

export const URLMapSchema = z.record(URLSchema);

export type URLMapPayload = z.infer<typeof URLMapSchema>;

export const URLMapHydrator = MapHydrator(PrimitiveHydrator<string>(), URLHydrator);
