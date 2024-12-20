import { List, Range } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/daily-report/templates';
import { DailyReport } from 'domains/daily-report';

import { Media } from '../../common';

import { DailyReportMedia } from './daily-report';

export class DailyReportsMedia extends Media<Partial<RawEntriesMedia>, List<DailyReport>> {
  public createSuccessfulContent(): string {
    return JSON.stringify(this._data);
  }

  public createFailureContent(): string {
    return JSON.stringify({
      errors: [
        {
          reason: 101,
          cause: 'unit',
          value: 'sku099',
        },
      ],
    });
  }

  protected fillByModel(overrides: List<DailyReport>): RawEntriesMedia {
    return {
      dailyReports: overrides.map((override) => new DailyReportMedia(override).data()).toArray(),
    };
  }

  protected fill(overrides?: Partial<RawEntriesMedia> | List<DailyReport>): RawEntriesMedia {
    if (List.isList(overrides)) {
      return this.fillByModel(overrides);
    }

    const dailyReports = Range(1, Math.floor(Math.random() * 10) + 1)
      .map(() => new DailyReportMedia().data())
      .toArray();

    return { dailyReports };
  }
}
