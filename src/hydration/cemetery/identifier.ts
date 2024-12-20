import { z } from 'zod';

import { CemeteryIdentifier } from 'domains/cemetery';
import {
  UniversallyUniqueIdentifierHydrator,
  universallyUniqueIdentifierSchema,
} from 'hydration/common/identifier';

export const cemeteryIdentifierSchema = universallyUniqueIdentifierSchema.brand(
  'CemeteryIdentifierSchema'
);

export type CemeteryIdentifierPayload = z.infer<typeof cemeteryIdentifierSchema>;

export const CemeteryIdentifierHydrator = UniversallyUniqueIdentifierHydrator<
  CemeteryIdentifier,
  CemeteryIdentifierPayload
>(CemeteryIdentifier);
