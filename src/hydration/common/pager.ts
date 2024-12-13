import { z } from 'zod';

import { Pager } from 'domains/common/pager';
import { Hydrator, asPayload } from 'hydration/common';

export const pagerSchema = z
  .object({
    total: z.number(),
    items: z.number(),
    current: z.number(),
  })
  .brand('PagerSchema');

export type PagerPayload = z.infer<typeof pagerSchema>;

export const PagerHydrator: Hydrator<Pager, PagerPayload> = {
  hydrate: (value) => new Pager(value.total, value.items, value.current),

  dehydrate: (value) =>
    ({
      total: value.total,
      items: value.items,
      current: value.current,
    }) as PagerPayload,

  asPayload: (value) => asPayload(value, pagerSchema),
};
