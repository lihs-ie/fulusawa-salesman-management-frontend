import { v7 as uuid } from 'uuid';

import { EntryMedia, RawEntryMedia } from 'acl/fsm-backend/daily-report/templates';
import { DailyReport } from 'domains/daily-report';

import { Media } from '../../common';

export class DailyReportMedia extends Media<Partial<RawEntryMedia>, DailyReport> {
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

  protected fillByModel(overrides: DailyReport): RawEntryMedia {
    return {
      identifier: overrides.identifier.value,
      user: overrides.user.value,
      date: overrides.date.toISOString(),
      schedules: overrides.schedules.map((schedule) => schedule.value).toArray(),
      visits: overrides.visits.map((visit) => visit.value).toArray(),
      isSubmitted: overrides.isSubmitted,
    };
  }

  protected fill(overrides?: Partial<RawEntryMedia> | DailyReport): RawEntryMedia {
    if (overrides instanceof DailyReport) {
      return this.fillByModel(overrides);
    }

    return {
      identifier: uuid(),
      user: uuid(),
      date: new Date().toISOString(),
      schedules: [],
      visits: [],
      isSubmitted: Math.random() < 0.5,
      ...overrides,
    };
  }
}

expect.extend({
  toBeExpectedDailyReportMedia(actual: EntryMedia, expected: RawEntryMedia) {
    try {
      expect(actual.identifier).toBe(expected.identifier);
      expect(actual.user).toBe(expected.user);
      expect(actual.date.toISOString()).toBe(expected.date);
      expect(actual.schedules.toArray()).toStrictEqual(expected.schedules);
      expect(actual.visits.toArray()).toStrictEqual(expected.visits);
      expect(actual.isSubmitted).toBe(expected.isSubmitted);

      return {
        message: () => 'OK',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => (error as Error).message,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeExpectedDailyReportMedia(expected: RawEntryMedia): R;
    }
  }
}
