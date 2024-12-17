import { z } from 'zod';

import { Role, User, UserIdentifier } from 'domains/user';
import { asPayload, Hydrator, OptionalHydrator } from 'hydration/common';
import { AddressHydrator, addressSchema } from 'hydration/common/address';
import {
  MailAddressHydrator,
  mailAddressSchema,
  PhoneNumberHydrator,
  phoneNumberSchema,
} from 'hydration/common/contact';
import {
  UniversallyUniqueIdentifierHydrator,
  universallyUniqueIdentifierSchema,
} from 'hydration/common/identifier';
import { PasswordHydrator, passwordSchema } from 'hydration/user/credentials';

export const userIdentifierSchema = universallyUniqueIdentifierSchema.brand('UserIdentifierSchema');

export type UserIdentifierPayload = z.infer<typeof userIdentifierSchema>;

export const UserIdentifierHydrator = UniversallyUniqueIdentifierHydrator<
  UserIdentifier,
  UserIdentifierPayload
>(UserIdentifier);

export const roleSchema = z.nativeEnum(Role);

export type RolePayload = z.infer<typeof roleSchema>;

export const userSchema = z
  .object({
    identifier: userIdentifierSchema,
    firstName: z.string().min(1).max(User.MAX_FIRST_NAME_LENGTH),
    lastName: z.string().min(1).max(User.MAX_LAST_NAME_LENGTH),
    address: addressSchema,
    phone: phoneNumberSchema,
    email: mailAddressSchema,
    password: passwordSchema.nullable(),
    role: roleSchema,
  })
  .brand('UserSchema');

export type UserPayload = z.infer<typeof userSchema>;

export const UserHydrator: Hydrator<User, UserPayload> = {
  hydrate: (value) =>
    new User(
      UserIdentifierHydrator.hydrate(value.identifier),
      value.firstName,
      value.lastName,
      AddressHydrator.hydrate(value.address),
      PhoneNumberHydrator.hydrate(value.phone),
      MailAddressHydrator.hydrate(value.email),
      OptionalHydrator(PasswordHydrator).hydrate(value.password),
      value.role
    ),

  dehydrate: (value) =>
    ({
      identifier: UserIdentifierHydrator.dehydrate(value.identifier),
      firstName: value.firstName,
      lastName: value.lastName,
      address: AddressHydrator.dehydrate(value.address),
      phone: PhoneNumberHydrator.dehydrate(value.phone),
      email: MailAddressHydrator.dehydrate(value.email),
      password: OptionalHydrator(PasswordHydrator).dehydrate(value.password),
      role: value.role,
    }) as UserPayload,

  asPayload: (value) => asPayload(value, userSchema),
};
