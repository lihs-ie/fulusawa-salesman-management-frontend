import { List, Set } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { Schedule } from 'domains/schedule';

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
      entries: List(media.schedules).map((entry) => this.mapEntry(entry)),
    };
  }

  public readEntry(payload: string): EntryMedia {
    const media = JSON.parse(payload) as RawEntryMedia;

    return {
      ...media,
      participants: Set(media.participants),
      date: {
        start: new Date(media.date.start),
        end: new Date(media.date.end),
      },
    };
  }

  private mapEntry(media: RawEntryMedia): EntryMedia {
    return {
      ...media,
      participants: Set(media.participants),
      date: {
        start: new Date(media.date.start),
        end: new Date(media.date.end),
      },
    };
  }
}

export type Body = {
  identifier: string;
  participants: Array<string>;
  creator: string;
  updater: string;
  customer: string | null;
  content: {
    title: string;
    description: string | null;
  };
  date: {
    start: string;
    end: string;
  };
  status: string;
  repeat: null | {
    type: string;
    interval: number;
  };
};

@injectable()
export class Writer extends BaseWriter {
  public write(schedule: Schedule): string {
    const body: Body = {
      identifier: schedule.identifier.value,
      participants: schedule.participants.map((participant) => participant.value).toArray(),
      creator: schedule.creator.value,
      updater: schedule.updater.value,
      customer: schedule.customer?.value ?? null,
      content: {
        title: schedule.content.title,
        description: schedule.content.description,
      },
      date: {
        start: schedule.date.min!.toISOString(),
        end: schedule.date.max!.toISOString(),
      },
      status: schedule.status,
      repeat: schedule.repeat
        ? {
            type: schedule.repeat.type,
            interval: schedule.repeat.interval,
          }
        : null,
    };

    return JSON.stringify(body);
  }
}
