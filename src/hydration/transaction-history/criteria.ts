import { z } from 'zod';

import { Criteria, Sort } from 'domains/transaction-history';
import { asPayload, Hydrator, OptionalHydrator } from 'hydration/common';
import { CustomerIdentifierHydrator, customerIdentifierSchema } from 'hydration/customer';
import { UserIdentifierHydrator, userIdentifierSchema } from 'hydration/user';

export const sortSchema = z.nativeEnum(Sort).brand('SortSchema');

export type SortPayload = z.infer<typeof sortSchema>;

export const criteriaSchema = z
  .object({
    user: userIdentifierSchema.nullable(),
    customer: customerIdentifierSchema.nullable(),
    sort: sortSchema.nullable(),
  })
  .brand('CriteriaSchema');

export type CriteriaPayload = z.infer<typeof criteriaSchema>;

export const criteriaHydrator: Hydrator<Criteria, CriteriaPayload> = {
  hydrate: (value) =>
    new Criteria(
      OptionalHydrator(UserIdentifierHydrator).hydrate(value.user),
      OptionalHydrator(CustomerIdentifierHydrator).hydrate(value.customer),
      value.sort
    ),

  dehydrate: (value) =>
    ({
      user: OptionalHydrator(UserIdentifierHydrator).dehydrate(value.user),
      customer: OptionalHydrator(CustomerIdentifierHydrator).dehydrate(value.customer),
      sort: value.sort,
    }) as CriteriaPayload,

  asPayload: (value) => asPayload(value, criteriaSchema),
};
