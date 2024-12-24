import { injectable } from 'inversify';

import {
  EntriesMedia,
  EntriesReader,
  Writer as BaseWriter,
  AddressMedia,
  PhoneNumberMedia,
  CommonDomainWriter,
} from 'acl/fsm-backend/common';
import { Visit } from 'domains/visit';

export type RawEntryMedia = {
  identifier: string;
  user: string;
  visitedAt: string;
  address: AddressMedia;
  phone: PhoneNumberMedia | null;
  hasGraveyard: boolean;
  note: string | null;
  result: string;
};

export type RawEntriesMedia = {
  visits: Array<RawEntryMedia>;
};

export type EntryMedia = {
  identifier: string;
  user: string;
  visitedAt: Date;
  address: AddressMedia;
  phone: PhoneNumberMedia | null;
  hasGraveyard: boolean;
  note: string | null;
  result: string;
};

@injectable()
export abstract class Reader implements EntriesReader<EntryMedia> {
  public abstract read(payload: string): EntriesMedia<EntryMedia>;

  public abstract readEntry(payload: string): EntryMedia;
}

export type Body = {
  identifier: string;
  user: string;
  visitedAt: string;
  address: AddressMedia;
  phone: PhoneNumberMedia | null;
  hasGraveyard: boolean;
  note: string | null;
  result: string;
};

@injectable()
export abstract class Writer implements BaseWriter<Visit> {
  protected readonly commonWriter: CommonDomainWriter;

  public constructor() {
    this.commonWriter = new CommonDomainWriter();
  }

  public abstract write(visit: Visit): string;
}
