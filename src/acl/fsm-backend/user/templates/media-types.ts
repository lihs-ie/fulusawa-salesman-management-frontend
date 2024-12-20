import { injectable } from 'inversify';

import {
  EntriesMedia,
  EntriesReader,
  Writer as BaseWriter,
  AddressMedia,
  PhoneNumberMedia,
  CommonDomainWriter,
} from 'acl/fsm-backend/common';
import { User } from 'domains/user';

export type RawEntryMedia = {
  identifier: string;
  name: {
    first: string;
    last: string;
  };
  address: AddressMedia;
  phone: PhoneNumberMedia;
  email: string;
  role: string;
};

export type RawEntriesMedia = {
  users: Array<RawEntryMedia>;
};

export type EntryMedia = RawEntryMedia;

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
export abstract class Writer implements BaseWriter<User> {
  protected readonly commonWriter: CommonDomainWriter;

  public constructor() {
    this.commonWriter = new CommonDomainWriter();
  }

  public abstract write(user: User): string;
}
