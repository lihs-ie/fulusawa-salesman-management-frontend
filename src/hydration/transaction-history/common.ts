import { z } from 'zod';

import { TransactionHistory, Type } from 'domains/transaction-history';
import { asPayload, Hydrator } from 'hydration/common';
import {
  CustomerIdentifierHydrator,
  customerIdentifierSchema,
} from 'hydration/customer/identifier';
import { UserIdentifierHydrator, userIdentifierSchema } from 'hydration/user';

import {
  TransactionHistoryIdentifierHydrator,
  transactionHistoryIdentifierSchema,
} from './identifier';

export const typeSchema = z.nativeEnum(Type).brand('TypeSchema');

export type TypePayload = z.infer<typeof typeSchema>;

export const transactionHistorySchema = z
  .object({
    identifier: transactionHistoryIdentifierSchema,
    customer: customerIdentifierSchema,
    user: userIdentifierSchema,
    type: typeSchema,
    description: z.string().min(1).max(TransactionHistory.MAX_DESCRIPTION_LENGTH).nullable(),
    date: z.date(),
  })
  .brand('TransactionHistorySchema');

export type TransactionHistoryPayload = z.infer<typeof transactionHistorySchema>;

export const TransactionHistoryHydrator: Hydrator<TransactionHistory, TransactionHistoryPayload> = {
  hydrate: (value) =>
    new TransactionHistory(
      TransactionHistoryIdentifierHydrator.hydrate(value.identifier),
      CustomerIdentifierHydrator.hydrate(value.customer),
      UserIdentifierHydrator.hydrate(value.user),
      value.type,
      value.description,
      value.date
    ),

  dehydrate: (value) =>
    ({
      identifier: TransactionHistoryIdentifierHydrator.dehydrate(value.identifier),
      customer: CustomerIdentifierHydrator.dehydrate(value.customer),
      user: UserIdentifierHydrator.dehydrate(value.user),
      type: value.type,
      description: value.description,
      date: value.date,
    }) as TransactionHistoryPayload,

  asPayload: (value) => asPayload(value, transactionHistorySchema),
};
