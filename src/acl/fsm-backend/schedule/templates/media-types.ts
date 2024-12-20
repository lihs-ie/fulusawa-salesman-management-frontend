import { Set } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia, EntriesReader, Writer as BaseWriter } from 'acl/fsm-backend/common';
import { Schedule } from 'domains/schedule';

export type RawEntryMedia = {
  identifier: string;
  participants: Array<string>;
  creator: string;
  updater: string;
  customer: string | null;
  content: {
    title: string;
    description: string | null;
  };
  date: {
    start: string;
    end: string;
  };
  status: string;
  repeat: null | {
    type: string;
    interval: number;
  };
};

export type RawEntriesMedia = {
  schedules: Array<RawEntryMedia>;
};

export type EntryMedia = {
  identifier: string;
  participants: Set<string>;
  creator: string;
  updater: string;
  customer: string | null;
  content: {
    title: string;
    description: string | null;
  };
  date: {
    start: Date;
    end: Date;
  };
  status: string;
  repeat: null | {
    type: string;
    interval: number;
  };
};

@injectable()
export abstract class Reader implements EntriesReader<EntryMedia> {
  public abstract read(payload: string): EntriesMedia<EntryMedia>;

  public abstract readEntry(payload: string): EntryMedia;
}

export type Body = {
  identifier: string;
  participants: Array<string>;
  creator: string;
  updater: string;
  customer: string | null;
  content: {
    title: string;
    description: string | null;
  };
  date: {
    start: string;
    end: string;
  };
  status: string;
  repeat: null | {
    type: string;
    interval: number;
  };
};

@injectable()
export abstract class Writer implements BaseWriter<Schedule> {
  public abstract write(schedule: Schedule): string;
}
