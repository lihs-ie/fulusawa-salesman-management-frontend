import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { CustomerIdentifier } from 'domains/customer';
import {
  asType,
  TransactionHistory,
  TransactionHistoryIdentifier,
} from 'domains/transaction-history';
import { UserIdentifier } from 'domains/user';

import { Translator as BaseTranslator, EntryMedia } from '../templates';

@injectable()
export class Translator extends BaseTranslator {
  public constructor() {
    super();
  }

  public translate(media: EntriesMedia<EntryMedia>): List<TransactionHistory> {
    return media.entries.map((entry) => this.translateEntry(entry));
  }

  public translateEntry(media: EntryMedia): TransactionHistory {
    return new TransactionHistory(
      new TransactionHistoryIdentifier(media.identifier),
      new CustomerIdentifier(media.customer),
      new UserIdentifier(media.user),
      asType(media.type),
      media.description,
      media.date
    );
  }
}
