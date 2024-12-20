import { z } from 'zod';

import { Customer } from 'domains/customer';
import {
  CemeteryIdentifierHydrator,
  cemeteryIdentifierSchema,
} from 'hydration/cemetery/identifier';
import { ListHydrator } from 'hydration/collection';
import { asPayload, Hydrator } from 'hydration/common';
import { AddressHydrator, addressSchema } from 'hydration/common/address';
import { PhoneNumberHydrator, phoneNumberSchema } from 'hydration/common/contact';
import {
  TransactionHistoryIdentifierHydrator,
  transactionHistoryIdentifierSchema,
} from 'hydration/transaction-history/identifier';

import { CustomerIdentifierHydrator, customerIdentifierSchema } from './identifier';

export const customerSchema = z
  .object({
    identifier: customerIdentifierSchema,
    lastName: z.string().min(1).max(Customer.MAX_LAST_NAME_LENGTH),
    firstName: z.string().min(1).max(Customer.MAX_FIRST_NAME_LENGTH).nullable(),
    address: addressSchema,
    phone: phoneNumberSchema,
    cemeteries: z.array(cemeteryIdentifierSchema),
    transactionHistories: z.array(transactionHistoryIdentifierSchema),
  })
  .brand('CustomerSchema');

export type CustomerPayload = z.infer<typeof customerSchema>;

export const CustomerHydrator: Hydrator<Customer, CustomerPayload> = {
  hydrate: (value) =>
    new Customer(
      CustomerIdentifierHydrator.hydrate(value.identifier),
      value.lastName,
      value.firstName,
      AddressHydrator.hydrate(value.address),
      PhoneNumberHydrator.hydrate(value.phone),
      ListHydrator(CemeteryIdentifierHydrator).hydrate(value.cemeteries),
      ListHydrator(TransactionHistoryIdentifierHydrator).hydrate(value.transactionHistories)
    ),

  dehydrate: (value) =>
    ({
      identifier: CustomerIdentifierHydrator.dehydrate(value.identifier),
      lastName: value.lastName,
      firstName: value.firstName,
      address: AddressHydrator.dehydrate(value.address),
      phone: PhoneNumberHydrator.dehydrate(value.phone),
      cemeteries: ListHydrator(CemeteryIdentifierHydrator).dehydrate(value.cemeteries),
      transactionHistories: ListHydrator(TransactionHistoryIdentifierHydrator).dehydrate(
        value.transactionHistories
      ),
    }) as CustomerPayload,

  asPayload: (value) => asPayload(value, customerSchema),
};
