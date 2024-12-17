import { z } from 'zod';

import { Criteria, Sort } from 'domains/feedback';
import { asPayload, Hydrator } from 'hydration/common';

import { statusSchema, typeSchema } from './common';

export const sortSchema = z.nativeEnum(Sort).brand('SortSchema');

export type SortPayload = z.infer<typeof sortSchema>;

export const criteriaSchema = z
  .object({
    type: typeSchema.nullable(),
    status: statusSchema.nullable(),
    sort: sortSchema.nullable(),
  })
  .brand('CriteriaSchema');

export type CriteriaPayload = z.infer<typeof criteriaSchema>;

export const CriteriaHydrator: Hydrator<Criteria, CriteriaPayload> = {
  hydrate: (value) => new Criteria(value.type, value.status, value.sort),

  dehydrate: (value) =>
    ({
      type: value.type,
      status: value.status,
      sort: value.sort,
    }) as CriteriaPayload,

  asPayload: (value) => asPayload(value, criteriaSchema),
};
