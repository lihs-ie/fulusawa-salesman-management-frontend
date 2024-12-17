import { z } from 'zod';

import { Criteria } from 'domains/cemetery';
import { asPayload, Hydrator, OptionalHydrator } from 'hydration/common';
import { CustomerIdentifierHydrator, customerIdentifierSchema } from 'hydration/customer/common';

export const criteriaSchema = z
  .object({
    customer: customerIdentifierSchema.nullable(),
  })
  .brand('CriteriaSchema');

export type CriteriaPayload = z.infer<typeof criteriaSchema>;

export const CriteriaHydrator: Hydrator<Criteria, CriteriaPayload> = {
  hydrate: (value) =>
    new Criteria(OptionalHydrator(CustomerIdentifierHydrator).hydrate(value.customer)),

  dehydrate: (value) =>
    ({
      customer: OptionalHydrator(CustomerIdentifierHydrator).dehydrate(value.customer),
    }) as CriteriaPayload,

  asPayload: (value) => asPayload(value, criteriaSchema),
};
