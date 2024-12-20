import { List } from 'immutable';
import { injectable } from 'inversify';

import { AddressMedia, EntriesMedia, PhoneNumberMedia } from 'acl/fsm-backend/common';
import { Customer } from 'domains/customer';

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
      entries: List(media.customers).map((entry) => this.mapEntry(entry)),
    };
  }

  public readEntry(payload: string): EntryMedia {
    const media = JSON.parse(payload) as RawEntryMedia;

    return {
      ...media,
      cemeteries: List(media.cemeteries),
      transactionHistories: List(media.transactionHistories),
    };
  }

  private mapEntry(media: RawEntryMedia): EntryMedia {
    return {
      ...media,
      cemeteries: List(media.cemeteries),
      transactionHistories: List(media.transactionHistories),
    };
  }
}

export type Body = {
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

@injectable()
export class Writer extends BaseWriter {
  public write(customer: Customer): string {
    const body: Body = {
      identifier: customer.identifier.value,
      name: {
        first: customer.firstName,
        last: customer.lastName,
      },
      address: this.commonWriter.writeAddress(customer.address),
      phone: this.commonWriter.writePhoneNumber(customer.phone),
      cemeteries: customer.cemeteries.map((cemetery) => cemetery.value).toArray(),
      transactionHistories: customer.transactionHistories
        .map((transactionHistory) => transactionHistory.value)
        .toArray(),
    };

    return JSON.stringify(body);
  }
}
