import { List } from 'immutable';
import { injectable } from 'inversify';

import { AddressMedia, EntriesMedia, PhoneNumberMedia } from 'acl/fsm-backend/common';
import { User } from 'domains/user';

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
      entries: List(media.users),
    };
  }

  public readEntry(payload: string): EntryMedia {
    return JSON.parse(payload) as RawEntryMedia;
  }
}

export type Body = {
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

@injectable()
export class Writer extends BaseWriter {
  public write(user: User): string {
    const body: Body = {
      identifier: user.identifier.value,
      name: {
        first: user.firstName,
        last: user.lastName,
      },
      address: this.commonWriter.writeAddress(user.address),
      phone: this.commonWriter.writePhoneNumber(user.phone),
      email: user.email.toString(),
      role: user.role,
    };

    return JSON.stringify(body);
  }
}
