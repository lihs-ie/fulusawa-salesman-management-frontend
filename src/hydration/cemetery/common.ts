import { z } from 'zod';

import { Cemetery, CemeteryIdentifier, CemeteryType } from 'domains/cemetery';
import { asPayload, Hydrator } from 'hydration/common';
import {
  UniversallyUniqueIdentifierHydrator,
  universallyUniqueIdentifierSchema,
} from 'hydration/common/identifier';
import { CustomerIdentifierHydrator, customerIdentifierSchema } from 'hydration/customer/common';

export const cemeteryIdentifierSchema = universallyUniqueIdentifierSchema.brand(
  'CemeteryIdentifierSchema'
);

export type CemeteryIdentifierPayload = z.infer<typeof cemeteryIdentifierSchema>;

export const CemeteryIdentifierHydrator = UniversallyUniqueIdentifierHydrator<
  CemeteryIdentifier,
  CemeteryIdentifierPayload
>(CemeteryIdentifier);

export const cemeteryTypeSchema = z.nativeEnum(CemeteryType).brand('CemeteryTypeSchema');

export type CemeteryTypePayload = z.infer<typeof cemeteryTypeSchema>;

export const cemeterySchema = z
  .object({
    identifier: cemeteryIdentifierSchema,
    customer: customerIdentifierSchema,
    name: z.string().min(1).max(Cemetery.MAX_NAME_LENGTH),
    type: cemeteryTypeSchema,
    construction: z.date(),
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
      value.construction,
      value.inHouse
    ),

  dehydrate: (value) =>
    ({
      identifier: CemeteryIdentifierHydrator.dehydrate(value.identifier),
      customer: CustomerIdentifierHydrator.dehydrate(value.customer),
      name: value.name,
      type: value.type,
      construction: value.construction,
      inHouse: value.inHouse,
    }) as CemeteryPayload,

  asPayload: (value) => asPayload(value, cemeterySchema),
};
