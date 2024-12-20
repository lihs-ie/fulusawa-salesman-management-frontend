import { z } from 'zod';

import { Criteria } from 'domains/schedule';
import { asPayload, Hydrator, OptionalHydrator } from 'hydration/common';
import { DateTimeRangeHydrator, dateTimeRangeSchema } from 'hydration/common/date';
import { UserIdentifierHydrator, userIdentifierSchema } from 'hydration/user';

import { statusSchema } from './common';

export const criteriaSchema = z
  .object({
    status: statusSchema.nullable(),
    date: dateTimeRangeSchema.nullable(),
    title: z.string().min(1).max(Criteria.MAX_TITLE_LENGTH).nullable(),
    user: userIdentifierSchema.nullable(),
  })
  .brand('CriteriaSchema');

export type CriteriaPayload = z.infer<typeof criteriaSchema>;

export const CriteriaHydrator: Hydrator<Criteria, CriteriaPayload> = {
  hydrate: (value) =>
    new Criteria(
      value.status,
      OptionalHydrator(DateTimeRangeHydrator).hydrate(value.date),
      value.title,
      OptionalHydrator(UserIdentifierHydrator).hydrate(value.user)
    ),

  dehydrate: (value) =>
    ({
      status: value.status,
      date: OptionalHydrator(DateTimeRangeHydrator).dehydrate(value.date),
      title: value.title,
      user: OptionalHydrator(UserIdentifierHydrator).dehydrate(value.user),
    }) as CriteriaPayload,

  asPayload: (value) => asPayload(value, criteriaSchema),
};
