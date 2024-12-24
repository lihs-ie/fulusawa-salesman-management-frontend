import { List } from 'immutable';
import { injectable } from 'inversify';

import {
  EntriesMedia,
  EntriesReader,
  Writer as BaseWriter,
  AddressMedia,
  PhoneNumberMedia,
  CommonDomainWriter,
} from 'acl/fsm-backend/common';
import { Customer } from 'domains/customer';

export type RawEntryMedia = {
  identifier: string;
  name: {
    first: string | null;
    last: string;
  };
  address: AddressMedia;
  phone: PhoneNumberMedia;
  cemeteries: Array<string>;
  transactionHistories: Array<string>;
};

export type RawEntriesMedia = {
  customers: Array<RawEntryMedia>;
};

export type EntryMedia = {
  identifier: string;
  name: {
    first: string | null;
    last: string;
  };
  address: AddressMedia;
  phone: PhoneNumberMedia;
  cemeteries: List<string>;
  transactionHistories: List<string>;
};

@injectable()
export abstract class Reader implements EntriesReader<EntryMedia> {
  public abstract read(payload: string): EntriesMedia<EntryMedia>;

  public abstract readEntry(payload: string): EntryMedia;
}

@injectable()
export abstract class Writer implements BaseWriter<Customer> {
  protected readonly commonWriter: CommonDomainWriter;

  public constructor() {
    this.commonWriter = new CommonDomainWriter();
  }

  public abstract write(customer: Customer): string;
}
