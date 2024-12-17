import { z } from 'zod';

import { Criteria } from 'domains/daily-report';
import { asPayload, Hydrator, OptionalHydrator } from 'hydration/common';
import { DateTimeRangeHydrator, dateTimeRangeSchema } from 'hydration/common/date';
import { UserIdentifierHydrator, userIdentifierSchema } from 'hydration/user';

export const criteriaSchema = z
  .object({
    date: dateTimeRangeSchema.nullable(),
    user: userIdentifierSchema.nullable(),
    isSubmitted: z.boolean().nullable(),
  })
  .brand('CriteriaSchema');

export type CriteriaPayload = z.infer<typeof criteriaSchema>;

export const CriteriaHydrator: Hydrator<Criteria, CriteriaPayload> = {
  hydrate: (value) =>
    new Criteria(
      OptionalHydrator(DateTimeRangeHydrator).hydrate(value.date),
      OptionalHydrator(UserIdentifierHydrator).hydrate(value.user),
      value.isSubmitted
    ),

  dehydrate: (value) =>
    ({
      date: OptionalHydrator(DateTimeRangeHydrator).dehydrate(value.date),
      user: OptionalHydrator(UserIdentifierHydrator).dehydrate(value.user),
      isSubmitted: value.isSubmitted,
    }) as CriteriaPayload,

  asPayload: (value) => asPayload(value, criteriaSchema),
};
