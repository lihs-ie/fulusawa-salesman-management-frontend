import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { DailyReport } from 'domains/daily-report';

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
      entries: List(media.dailyReports).map((entry) => this.mapEntry(entry)),
    };
  }

  public readEntry(payload: string): EntryMedia {
    const media = JSON.parse(payload) as RawEntryMedia;

    return {
      ...media,
      date: new Date(media.date),
      schedules: List(media.schedules),
      visits: List(media.visits),
    };
  }

  private mapEntry(media: RawEntryMedia): EntryMedia {
    return {
      ...media,
      date: new Date(media.date),
      schedules: List(media.schedules),
      visits: List(media.visits),
    };
  }
}

export type Body = {
  identifier: string;
  user: string;
  date: string;
  schedules: Array<string>;
  visits: Array<string>;
  isSubmitted: boolean;
};

@injectable()
export class Writer extends BaseWriter {
  public write(dailyReport: DailyReport): string {
    const body: Body = {
      identifier: dailyReport.identifier.value,
      user: dailyReport.user.value,
      date: dailyReport.date.toISOString(),
      schedules: dailyReport.schedules.map((schedule) => schedule.value).toArray(),
      visits: dailyReport.visits.map((visit) => visit.value).toArray(),
      isSubmitted: dailyReport.isSubmitted,
    };

    return JSON.stringify(body);
  }
}
