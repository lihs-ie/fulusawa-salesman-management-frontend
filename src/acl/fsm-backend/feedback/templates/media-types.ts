import { injectable } from 'inversify';

import { EntriesMedia, EntriesReader, Writer as BaseWriter } from 'acl/fsm-backend/common';
import { Feedback } from 'domains/feedback';

export type RawEntryMedia = {
  identifier: string;
  type: string;
  status: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type RawEntriesMedia = {
  feedbacks: Array<RawEntryMedia>;
};

export type EntryMedia = {
  identifier: string;
  type: string;
  status: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

@injectable()
export abstract class Reader implements EntriesReader<EntryMedia> {
  public abstract read(payload: string): EntriesMedia<EntryMedia>;

  public abstract readEntry(payload: string): EntryMedia;
}

export type Body = {
  identifier: string;
  type: string;
  status: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

@injectable()
export abstract class Writer implements BaseWriter<Feedback> {
  public abstract write(feedback: Feedback): string;
}
