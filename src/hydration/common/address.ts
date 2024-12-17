import { z } from 'zod';

import { Address, PostalCode, Prefecture } from 'domains/common';
import { asPayload, Hydrator } from 'hydration/common';
import { enumSchema } from 'hydration/schema';

export const prefectureSchema = enumSchema(Prefecture).brand('PrefectureSchema');

export type PrefecturePayload = z.infer<typeof prefectureSchema>;

export const postalCodeSchema = z
  .object({
    first: z.string().regex(PostalCode.VALID_FIRST_PATTERN),
    second: z.string().regex(PostalCode.VALID_SECOND_PATTERN),
  })
  .brand('PostalCodeSchema');

export type PostalCodePayload = z.infer<typeof postalCodeSchema>;

export const PostalCodeHydrator: Hydrator<PostalCode, PostalCodePayload> = {
  hydrate: (value) => new PostalCode(value.first, value.second),

  dehydrate: (value) =>
    ({
      first: value.first,
      second: value.second,
    }) as PostalCodePayload,

  asPayload: (value) => asPayload(value, postalCodeSchema),
};

export const addressSchema = z
  .object({
    postalCode: postalCodeSchema,
    prefecture: prefectureSchema,
    city: z.string().min(1).max(Address.MAX_CITY_LENGTH),
    street: z.string().min(1).max(Address.MAX_STREET_LENGTH),
    building: z.string().min(1).max(Address.MAX_BUILDING_LENGTH).nullable(),
  })
  .brand('AddressSchema');

export type AddressPayload = z.infer<typeof addressSchema>;

export const AddressHydrator: Hydrator<Address, AddressPayload> = {
  hydrate: (value) =>
    new Address(
      value.prefecture,
      PostalCodeHydrator.hydrate(value.postalCode),
      value.city,
      value.street,
      value.building
    ),

  dehydrate: (value) =>
    ({
      postalCode: PostalCodeHydrator.dehydrate(value.postalCode),
      prefecture: value.prefecture,
      city: value.city,
      street: value.street,
      building: value.building,
    }) as AddressPayload,

  asPayload: (value) => asPayload(value, addressSchema),
};
