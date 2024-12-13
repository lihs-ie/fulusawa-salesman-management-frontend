import { z } from 'zod';

import { Result, Visit, VisitIdentifier } from 'domains/visit';
import { asPayload, Hydrator, OptionalHydrator } from 'hydration/common';
import { AddressHydrator, addressSchema } from 'hydration/common/address';
import { PhoneNumberHydrator, phoneNumberSchema } from 'hydration/common/contact';
import {
  UniversallyUniqueIdentifierHydrator,
  universallyUniqueIdentifierSchema,
} from 'hydration/common/identifier';
import { UserIdentifierHydrator, userIdentifierSchema } from 'hydration/user';

export const visitIdentifierSchema =
  universallyUniqueIdentifierSchema.brand('VisitIdentifierSchema');

export type VisitIdentifierPayload = z.infer<typeof visitIdentifierSchema>;

export const VisitIdentifierHydrator = UniversallyUniqueIdentifierHydrator<
  VisitIdentifier,
  VisitIdentifierPayload
>(VisitIdentifier);

export const resultSchema = z.nativeEnum(Result).brand('ResultSchema');

export type ResultPayload = z.infer<typeof resultSchema>;

export const visitSchema = z
  .object({
    identifier: visitIdentifierSchema,
    user: userIdentifierSchema,
    visitedAt: z.string().date(),
    address: addressSchema,
    phone: phoneNumberSchema.nullable(),
    hasGraveyard: z.boolean(),
    note: z.string().min(1).max(Visit.MAX_NOTE_LENGTH).nullable(),
    result: resultSchema,
  })
  .brand('VisitSchema');

export type VisitPayload = z.infer<typeof visitSchema>;

export const VisitHydrator: Hydrator<Visit, VisitPayload> = {
  hydrate: (value) =>
    new Visit(
      VisitIdentifierHydrator.hydrate(value.identifier),
      UserIdentifierHydrator.hydrate(value.user),
      new Date(value.visitedAt),
      AddressHydrator.hydrate(value.address),
      OptionalHydrator(PhoneNumberHydrator).hydrate(value.phone),
      value.hasGraveyard,
      value.note,
      value.result
    ),

  dehydrate: (value) =>
    ({
      identifier: VisitIdentifierHydrator.dehydrate(value.identifier),
      user: UserIdentifierHydrator.dehydrate(value.user),
      visitedAt: value.visitedAt.toISOString(),
      address: AddressHydrator.dehydrate(value.address),
      phone: OptionalHydrator(PhoneNumberHydrator).dehydrate(value.phone),
      hasGraveyard: value.hasGraveyard,
      note: value.note,
      result: value.result,
    }) as VisitPayload,

  asPayload: (value) => asPayload(value, visitSchema),
};
