import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { CemeteryIdentifier } from 'domains/cemetery';
import { Customer, CustomerIdentifier } from 'domains/customer';
import { TransactionHistoryIdentifier } from 'domains/transaction-history';

import { Translator as BaseTranslator, EntryMedia } from '../templates';

@injectable()
export class Translator extends BaseTranslator {
  public constructor() {
    super();
  }

  public translate(media: EntriesMedia<EntryMedia>): List<Customer> {
    return media.entries.map((entry) => this.translateEntry(entry));
  }

  public translateEntry(media: EntryMedia): Customer {
    return new Customer(
      new CustomerIdentifier(media.identifier),
      media.name.last,
      media.name.first,
      this.commonTranslator.translateAddress(media.address),
      this.commonTranslator.translatePhoneNumber(media.phone),
      media.cemeteries.map((cemetery) => new CemeteryIdentifier(cemetery)),
      media.transactionHistories.map(
        (transactionHistory) => new TransactionHistoryIdentifier(transactionHistory)
      )
    );
  }
}
