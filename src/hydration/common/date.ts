import { z } from 'zod';

import { DateTimeRange } from 'domains/common/date';
import { Hydrator, asPayload } from 'hydration/common';

export const dateTimeRangeSchema = z
  .object({
    min: z.nullable(z.string()),
    max: z.nullable(z.string()),
  })
  .brand('DateTimeRangeSchema');

export type DateTimeRangePayload = z.infer<typeof dateTimeRangeSchema>;

export const DateTimeRangeHydrator: Hydrator<DateTimeRange, DateTimeRangePayload> = {
  hydrate: (value) =>
    new DateTimeRange(
      value.min ? new Date(value.min) : null,
      value.max ? new Date(value.max) : null
    ),

  dehydrate: (value) =>
    ({
      min: value.min ? value.min.toISOString() : null,
      max: value.max ? value.max.toISOString() : null,
    }) as DateTimeRangePayload,

  asPayload: (value) => asPayload(value, dateTimeRangeSchema),
};
