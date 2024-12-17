import { z } from 'zod';

import { CustomerIdentifier } from 'domains/customer';
import {
  UniversallyUniqueIdentifierHydrator,
  universallyUniqueIdentifierSchema,
} from 'hydration/common/identifier';

export const customerIdentifierSchema = universallyUniqueIdentifierSchema.brand(
  'CustomerIdentifierSchema'
);

export type CustomerIdentifierPayload = z.infer<typeof customerIdentifierSchema>;

export const CustomerIdentifierHydrator = UniversallyUniqueIdentifierHydrator<
  CustomerIdentifier,
  CustomerIdentifierPayload
>(CustomerIdentifier);
