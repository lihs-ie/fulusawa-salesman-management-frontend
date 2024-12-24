import { List } from 'immutable';

import { Reader, Writer } from 'acl/fsm-backend/schedule/delegate';
import { Builder } from 'tests/factories';
import { ScheduleFactory } from 'tests/factories/domains/schedule';
import { SchedulesMedia, ScheduleMedia } from 'tests/mock/upstreams/fcm-backend/media';

describe('Package media-types', () => {
  describe('Class Reader', () => {
    describe('instantiate', () => {
      it('success', () => {
        const reader = new Reader();

        expect(reader).toBeInstanceOf(Reader);
      });
    });

    describe('read', () => {
      it('successfully returns entries media.', () => {
        const media = new SchedulesMedia();

        const expecteds = media.data();

        const reader = new Reader();

        const actuals = reader.read(media.createSuccessfulContent());

        List(expecteds.schedules)
          .zip(actuals.entries)
          .forEach(([expected, actual]) => {
            expect(actual).toBeExpectedScheduleMedia(expected);
          });
      });
    });

    describe('readEntry', () => {
      it('successfully returns entry media.', () => {
        const media = new ScheduleMedia();

        const expected = media.data();

        const reader = new Reader();

        const actual = reader.readEntry(media.createSuccessfulContent());

        expect(actual).toBeExpectedScheduleMedia(expected);
      });
    });
  });

  describe('Class Writer', () => {
    describe('instantiate', () => {
      it('success', () => {
        const writer = new Writer();

        expect(writer).toBeInstanceOf(Writer);
      });
    });

    describe('write', () => {
      it('successfully returns serialized schedule.', () => {
        const schedule = Builder.get(ScheduleFactory).build();

        const expected = JSON.stringify({
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
            start: schedule.date.min?.toISOString(),
            end: schedule.date.max?.toISOString(),
          },
          status: schedule.status,
          repeat: schedule.repeat
            ? {
                type: schedule.repeat.type,
                interval: schedule.repeat.interval,
              }
            : null,
        });

        const writer = new Writer();

        const actual = writer.write(schedule);

        expect(actual).toBe(expected);
      });
    });
  });
});
