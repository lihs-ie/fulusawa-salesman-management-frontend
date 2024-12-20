import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia, EntriesReader, Writer as BaseWriter } from 'acl/fsm-backend/common';
import { DailyReport } from 'domains/daily-report';

export type RawEntryMedia = {
  identifier: string;
  user: string;
  date: string;
  schedules: Array<string>;
  visits: Array<string>;
  isSubmitted: boolean;
};

export type RawEntriesMedia = {
  dailyReports: Array<RawEntryMedia>;
};

export type EntryMedia = {
  identifier: string;
  user: string;
  date: Date;
  schedules: List<string>;
  visits: List<string>;
  isSubmitted: boolean;
};

@injectable()
export abstract class Reader implements EntriesReader<EntryMedia> {
  public abstract read(payload: string): EntriesMedia<EntryMedia>;

  public abstract readEntry(payload: string): EntryMedia;
}

@injectable()
export abstract class Writer implements BaseWriter<DailyReport> {
  public abstract write(dailyReport: DailyReport): string;
}
