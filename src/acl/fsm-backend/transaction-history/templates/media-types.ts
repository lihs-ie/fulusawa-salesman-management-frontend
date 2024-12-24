import { injectable } from 'inversify';

import { EntriesMedia, EntriesReader, Writer as BaseWriter } from 'acl/fsm-backend/common';
import { TransactionHistory } from 'domains/transaction-history';

export type RawEntryMedia = {
  identifier: string;
  customer: string;
  user: string;
  type: string;
  description: string | null;
  date: string;
};

export type RawEntriesMedia = {
  transactionHistories: Array<RawEntryMedia>;
};

export type EntryMedia = {
  identifier: string;
  customer: string;
  user: string;
  type: string;
  description: string | null;
  date: Date;
};

@injectable()
export abstract class Reader implements EntriesReader<EntryMedia> {
  public abstract read(payload: string): EntriesMedia<EntryMedia>;

  public abstract readEntry(payload: string): EntryMedia;
}

@injectable()
export abstract class Writer implements BaseWriter<TransactionHistory> {
  public abstract write(transactionHistory: TransactionHistory): string;
}
