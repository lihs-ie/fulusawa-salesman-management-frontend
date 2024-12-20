import { injectable } from 'inversify';

import { EntriesMedia, EntriesReader, Writer as BaseWriter } from 'acl/fsm-backend/common';
import { Cemetery } from 'domains/cemetery';

export type RawEntryMedia = {
  identifier: string;
  customer: string;
  name: string;
  type: string;
  construction: string;
  inHouse: boolean;
};

export type RawEntriesMedia = {
  cemeteries: Array<RawEntryMedia>;
};

export type EntryMedia = {
  identifier: string;
  customer: string;
  name: string;
  type: string;
  construction: Date;
  inHouse: boolean;
};

@injectable()
export abstract class Reader implements EntriesReader<EntryMedia> {
  public abstract read(payload: string): EntriesMedia<EntryMedia>;

  public abstract readEntry(payload: string): EntryMedia;
}

@injectable()
export abstract class Writer implements BaseWriter<Cemetery> {
  public abstract write(cemetery: Cemetery): string;
}
