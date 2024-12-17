import { z } from 'zod';

import { Criteria } from 'domains/customer';
import { asPayload, Hydrator, OptionalHydrator } from 'hydration/common';
import { PostalCodeHydrator, postalCodeSchema } from 'hydration/common/address';
import { PhoneNumberHydrator, phoneNumberSchema } from 'hydration/common/contact';

export const criteriaSchema = z
  .object({
    name: z.string().min(1).max(Criteria.MAX_NAME_LENGTH).nullable(),
    postalCode: postalCodeSchema.nullable(),
    phone: phoneNumberSchema.nullable(),
  })
  .brand('CriteriaSchema');

export type CriteriaPayload = z.infer<typeof criteriaSchema>;

export const CriteriaHydrator: Hydrator<Criteria, CriteriaPayload> = {
  hydrate: (value) =>
    new Criteria(
      value.name,
      OptionalHydrator(PostalCodeHydrator).hydrate(value.postalCode),
      OptionalHydrator(PhoneNumberHydrator).hydrate(value.phone)
    ),

  dehydrate: (value) =>
    ({
      name: value.name,
      postalCode: OptionalHydrator(PostalCodeHydrator).dehydrate(value.postalCode),
      phone: OptionalHydrator(PhoneNumberHydrator).dehydrate(value.phone),
    }) as CriteriaPayload,

  asPayload: (value) => asPayload(value, criteriaSchema),
};
