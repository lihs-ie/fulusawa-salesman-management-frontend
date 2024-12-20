import { z } from 'zod';

import { TransactionHistoryIdentifier } from 'domains/transaction-history';
import {
  UniversallyUniqueIdentifierHydrator,
  universallyUniqueIdentifierSchema,
} from 'hydration/common/identifier';

export const transactionHistoryIdentifierSchema = universallyUniqueIdentifierSchema.brand(
  'TransactionHistoryIdentifierSchema'
);

export type TransactionHistoryIdentifierPayload = z.infer<
  typeof transactionHistoryIdentifierSchema
>;

export const TransactionHistoryIdentifierHydrator = UniversallyUniqueIdentifierHydrator<
  TransactionHistoryIdentifier,
  TransactionHistoryIdentifierPayload
>(TransactionHistoryIdentifier);
