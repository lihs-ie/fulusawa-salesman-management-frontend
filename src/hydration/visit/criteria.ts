import { z } from 'zod';

import { Criteria, Sort } from 'domains/visit';
import { asPayload, Hydrator, OptionalHydrator } from 'hydration/common';
import { UserIdentifierHydrator, userIdentifierSchema } from 'hydration/user';

export const sortSchema = z.nativeEnum(Sort).brand('SortSchema');

export type SortPayload = z.infer<typeof sortSchema>;

export const criteriaSchema = z
  .object({
    user: userIdentifierSchema.nullable(),
    sort: sortSchema.nullable(),
  })
  .brand('CriteriaSchema');

export type CriteriaPayload = z.infer<typeof criteriaSchema>;

export const CriteriaHydrator: Hydrator<Criteria, CriteriaPayload> = {
  hydrate: (value) =>
    new Criteria(OptionalHydrator(UserIdentifierHydrator).hydrate(value.user), value.sort),

  dehydrate: (value) =>
    ({
      user: OptionalHydrator(UserIdentifierHydrator).dehydrate(value.user),
      sort: value.sort,
    }) as CriteriaPayload,

  asPayload: (value) => asPayload(value, criteriaSchema),
};
