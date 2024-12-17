import { z } from 'zod';

import { FrequencyType, RepeatFrequency } from 'domains/schedule';
import { asPayload, Hydrator } from 'hydration/common';

export const typeSchema = z.nativeEnum(FrequencyType);

export type TypePayload = z.infer<typeof typeSchema>;

export const repeatFrequencySchema = z
  .object({
    type: typeSchema,
    interval: z.number().int().min(1),
  })
  .brand('RepeatFrequencySchema');

export type RepeatFrequencyPayload = z.infer<typeof repeatFrequencySchema>;

export const RepeatFrequencyHydrator: Hydrator<RepeatFrequency, RepeatFrequencyPayload> = {
  hydrate: (value) => new RepeatFrequency(value.type, value.interval),

  dehydrate: (value) =>
    ({
      type: value.type,
      interval: value.interval,
    }) as RepeatFrequencyPayload,

  asPayload: (value) => asPayload(value, repeatFrequencySchema),
};
