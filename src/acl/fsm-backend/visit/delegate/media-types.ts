import { List } from 'immutable';
import { injectable } from 'inversify';

import { AddressMedia, EntriesMedia, PhoneNumberMedia } from 'acl/fsm-backend/common';
import { Visit } from 'domains/visit';

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
      entries: List(media.visits).map((entry) => this.mapEntry(entry)),
    };
  }

  public readEntry(payload: string): EntryMedia {
    const media = JSON.parse(payload) as RawEntryMedia;

    return {
      ...media,
      visitedAt: new Date(media.visitedAt),
    };
  }

  private mapEntry(media: RawEntryMedia): EntryMedia {
    return {
      ...media,
      visitedAt: new Date(media.visitedAt),
    };
  }
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
export class Writer extends BaseWriter {
  public write(visit: Visit): string {
    const body: Body = {
      identifier: visit.identifier.value,
      user: visit.user.value,
      visitedAt: visit.visitedAt.toISOString(),
      address: this.commonWriter.writeAddress(visit.address),
      phone: visit.phone ? this.commonWriter.writePhoneNumber(visit.phone) : null,
      hasGraveyard: visit.hasGraveyard,
      note: visit.note,
      result: visit.result,
    };

    return JSON.stringify(body);
  }
}
