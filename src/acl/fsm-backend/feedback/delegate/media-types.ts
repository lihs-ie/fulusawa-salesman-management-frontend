import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { Feedback } from 'domains/feedback';

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
      entries: List(media.feedbacks).map((entry) => this.mapEntry(entry)),
    };
  }

  public readEntry(payload: string): EntryMedia {
    const media = JSON.parse(payload) as RawEntryMedia;

    return {
      ...media,
      createdAt: new Date(media.createdAt),
      updatedAt: new Date(media.updatedAt),
    };
  }

  private mapEntry(media: RawEntryMedia): EntryMedia {
    return {
      ...media,
      createdAt: new Date(media.createdAt),
      updatedAt: new Date(media.updatedAt),
    };
  }
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
export class Writer extends BaseWriter {
  public write(feedback: Feedback): string {
    const body: Body = {
      identifier: feedback.identifier.value,
      type: feedback.type,
      status: feedback.status,
      content: feedback.content,
      createdAt: feedback.createdAt.toISOString(),
      updatedAt: feedback.updatedAt.toISOString(),
    };

    return JSON.stringify(body);
  }
}
