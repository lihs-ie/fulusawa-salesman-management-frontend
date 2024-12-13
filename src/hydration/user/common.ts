import { z } from 'zod';

import { UserIdentifier } from 'domains/user';
import {
  UniversallyUniqueIdentifierHydrator,
  universallyUniqueIdentifierSchema,
} from 'hydration/common/identifier';

export const userIdentifierSchema = universallyUniqueIdentifierSchema.brand('UserIdentifierSchema');

export type UserIdentifierPayload = z.infer<typeof userIdentifierSchema>;

export const UserIdentifierHydrator = UniversallyUniqueIdentifierHydrator<
  UserIdentifier,
  UserIdentifierPayload
>(UserIdentifier);
