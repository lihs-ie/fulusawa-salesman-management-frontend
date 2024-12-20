import { List, Range } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/schedule/templates';
import { Schedule } from 'domains/schedule';

import { Media } from '../../common';

import { ScheduleMedia } from './schedule';

export class SchedulesMedia extends Media<Partial<RawEntriesMedia>, List<Schedule>> {
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

  protected fillByModel(overrides: List<Schedule>): RawEntriesMedia {
    return {
      schedules: overrides.map((override) => new ScheduleMedia(override).data()).toArray(),
    };
  }

  protected fill(overrides?: Partial<RawEntriesMedia> | List<Schedule>): RawEntriesMedia {
    if (List.isList(overrides)) {
      return this.fillByModel(overrides);
    }

    const schedules = Range(1, Math.floor(Math.random() * 10) + 1)
      .map(() => new ScheduleMedia().data())
      .toArray();

    return { schedules };
  }
}
