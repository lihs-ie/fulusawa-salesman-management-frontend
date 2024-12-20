import { Range } from 'immutable';
import { v7 as uuid } from 'uuid';

import { EntryMedia, RawEntryMedia } from 'acl/fsm-backend/schedule/templates';
import { Content, Schedule } from 'domains/schedule';
import { Builder, StringFactory } from 'tests/factories';
import { StatusFactory } from 'tests/factories/domains/schedule';

import { Media } from '../../common';

export class ScheduleMedia extends Media<Partial<RawEntryMedia>, Schedule> {
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

  protected fillByModel(overrides: Schedule): RawEntryMedia {
    return {
      identifier: overrides.identifier.value,
      participants: overrides.participants.map((participant) => participant.value).toArray(),
      creator: overrides.creator.value,
      updater: overrides.updater.value,
      customer: overrides.customer?.value ?? null,
      content: {
        title: overrides.content.title,
        description: overrides.content.description,
      },
      date: {
        start: overrides.date.min!.toISOString(),
        end: overrides.date.max!.toISOString(),
      },
      status: overrides.status,
      repeat: overrides.repeat
        ? {
            type: overrides.repeat.type,
            interval: overrides.repeat.interval,
          }
        : null,
    };
  }

  protected fill(overrides?: Partial<RawEntryMedia> | Schedule): RawEntryMedia {
    if (overrides instanceof Schedule) {
      return this.fillByModel(overrides);
    }

    return {
      identifier: uuid(),
      participants: Range(1, Math.floor(Math.random() * 10) + 1)
        .map(() => uuid())
        .toArray(),
      creator: uuid(),
      updater: uuid(),
      customer: null,
      content: {
        title: Builder.get(StringFactory(1, Content.MAX_TITLE_LENGTH)).build(),
        description: null,
      },
      date: {
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
      status: Builder.get(StatusFactory).build(),
      repeat: null,
      ...overrides,
    };
  }
}

expect.extend({
  toBeExpectedScheduleMedia(actual: EntryMedia, expected: RawEntryMedia) {
    try {
      expect(actual.identifier).toBe(expected.identifier);
      expect(actual.participants.toArray().sort()).toEqual(expected.participants.sort());
      expect(actual.creator).toBe(expected.creator);
      expect(actual.updater).toBe(expected.updater);
      expect(actual.customer).toBeNullOr(expected.customer);
      expect(actual.content.title).toBe(expected.content.title);
      expect(actual.content.description).toBeNullOr(expected.content.description);
      expect(actual.date.start.toISOString()).toBe(expected.date.start);
      expect(actual.date.end.toISOString()).toBe(expected.date.end);
      expect(actual.status).toBe(expected.status);
      expect(actual.repeat).toBeNullOr(expected.repeat, (expectedRepeat, actualRepeat) => {
        expect(actualRepeat.type).toBe(expectedRepeat.type);
        expect(actualRepeat.interval).toBe(expectedRepeat.interval);
      });

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
      toBeExpectedScheduleMedia(expected: RawEntryMedia): R;
    }
  }
}
