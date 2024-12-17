import { z } from 'zod';

import { Password } from 'domains/user';
import { asPayload, Hydrator } from 'hydration/common';

export const passwordSchema = z
  .object({
    value: z.string().regex(Password.VALID_PATTERN),
  })
  .brand('PasswordSchema');

export type PasswordPayload = z.infer<typeof passwordSchema>;

export const PasswordHydrator: Hydrator<Password, PasswordPayload> = {
  hydrate: (value) => new Password(value.value),

  dehydrate: (value) => ({ value: value.value }) as PasswordPayload,

  asPayload: (value) => asPayload(value, passwordSchema),
};
