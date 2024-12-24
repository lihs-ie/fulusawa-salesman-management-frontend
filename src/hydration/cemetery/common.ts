import { z } from 'zod';

import { Cemetery, CemeteryType } from 'domains/cemetery';
import { asPayload, Hydrator } from 'hydration/common';
import { CustomerIdentifierHydrator, customerIdentifierSchema } from 'hydration/customer';

import { CemeteryIdentifierHydrator, cemeteryIdentifierSchema } from './identifier';

export const cemeteryTypeSchema = z.nativeEnum(CemeteryType).brand('CemeteryTypeSchema');

export type CemeteryTypePayload = z.infer<typeof cemeteryTypeSchema>;

export const cemeterySchema = z
  .object({
    identifier: cemeteryIdentifierSchema,
    customer: customerIdentifierSchema,
    name: z.string().min(1).max(Cemetery.MAX_NAME_LENGTH),
    type: cemeteryTypeSchema,
    construction: z.string().date(),
    inHouse: z.boolean(),
  })
  .brand('CemeterySchema');

export type CemeteryPayload = z.infer<typeof cemeterySchema>;

export const CemeteryHydrator: Hydrator<Cemetery, CemeteryPayload> = {
  hydrate: (value) =>
    new Cemetery(
      CemeteryIdentifierHydrator.hydrate(value.identifier),
      CustomerIdentifierHydrator.hydrate(value.customer),
      value.name,
      value.type,
      new Date(value.construction),
      value.inHouse
    ),

  dehydrate: (value) =>
    ({
      identifier: CemeteryIdentifierHydrator.dehydrate(value.identifier),
      customer: CustomerIdentifierHydrator.dehydrate(value.customer),
      name: value.name,
      type: value.type,
      construction: value.construction.toISOString(),
      inHouse: value.inHouse,
    }) as CemeteryPayload,

  asPayload: (value) => asPayload(value, cemeterySchema),
};
