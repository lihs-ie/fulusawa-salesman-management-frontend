import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { Cemetery } from 'domains/cemetery';

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
      entries: List(media.cemeteries).map((entry) => this.mapEntry(entry)),
    };
  }

  public readEntry(payload: string): EntryMedia {
    const media = JSON.parse(payload) as RawEntryMedia;

    return {
      ...media,
      construction: new Date(media.construction),
    };
  }

  private mapEntry(media: RawEntryMedia): EntryMedia {
    return {
      ...media,
      construction: new Date(media.construction),
    };
  }
}

@injectable()
export class Writer extends BaseWriter {
  public write(cemetery: Cemetery): string {
    return JSON.stringify({
      identifier: cemetery.identifier.value,
      customer: cemetery.customer.value,
      name: cemetery.name,
      type: cemetery.type,
      construction: cemetery.construction.toISOString(),
      inHouse: cemetery.inHouse,
    });
  }
}
