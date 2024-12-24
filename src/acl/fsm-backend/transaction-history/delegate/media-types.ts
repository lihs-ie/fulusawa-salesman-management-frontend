import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { TransactionHistory } from 'domains/transaction-history';

import {
  Reader as BaseReader,
  EntryMedia,
  RawEntriesMedia,
  RawEntryMedia,
  Writer as BaseWriter,
} from '../templates';

@injectable()
export class Reader extends BaseReader {
  public read(payload: string): EntriesMedia<EntryMedia> {
    const media = JSON.parse(payload) as RawEntriesMedia;

    return {
      entries: List(media.transactionHistories).map((entry) => this.mapEntry(entry)),
    };
  }

  public readEntry(payload: string): EntryMedia {
    const media = JSON.parse(payload) as RawEntryMedia;

    return {
      ...media,
      date: new Date(media.date),
    };
  }

  private mapEntry(media: RawEntryMedia): EntryMedia {
    return {
      ...media,
      date: new Date(media.date),
    };
  }
}

export type Body = {
  identifier: string;
  customer: string;
  user: string;
  type: string;
  description: string | null;
  date: string;
};

@injectable()
export class Writer extends BaseWriter {
  public write(transactionHistory: TransactionHistory): string {
    const body: Body = {
      identifier: transactionHistory.identifier.value,
      customer: transactionHistory.customer.value,
      user: transactionHistory.user.value,
      type: transactionHistory.type,
      description: transactionHistory.description,
      date: transactionHistory.date.toISOString(),
    };

    return JSON.stringify(body);
  }
}
