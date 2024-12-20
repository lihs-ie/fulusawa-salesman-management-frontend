import { List } from 'immutable';

import { Reader, Writer } from 'acl/fsm-backend/daily-report/delegate';
import { Builder } from 'tests/factories';
import { DailyReportFactory } from 'tests/factories/domains/daily-report';
import { DailyReportsMedia, DailyReportMedia } from 'tests/mock/upstreams/fcm-backend/media';

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
        const media = new DailyReportsMedia();

        const expecteds = media.data();

        const reader = new Reader();

        const actuals = reader.read(media.createSuccessfulContent());

        List(expecteds.dailyReports)
          .zip(actuals.entries)
          .forEach(([expected, actual]) => {
            expect(actual).toBeExpectedDailyReportMedia(expected);
          });
      });
    });

    describe('readEntry', () => {
      it('successfully returns entry media.', () => {
        const media = new DailyReportMedia();

        const expected = media.data();

        const reader = new Reader();

        const actual = reader.readEntry(media.createSuccessfulContent());

        expect(actual).toBeExpectedDailyReportMedia(expected);
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
      it('successfully returns serialized dailyReport.', () => {
        const dailyReport = Builder.get(DailyReportFactory).build();

        const expected = JSON.stringify({
          identifier: dailyReport.identifier.value,
          user: dailyReport.user.value,
          date: dailyReport.date.toISOString(),
          schedules: dailyReport.schedules.map((schedule) => schedule.value).toArray(),
          visits: dailyReport.visits.map((visit) => visit.value).toArray(),
          isSubmitted: dailyReport.isSubmitted,
        });

        const writer = new Writer();

        const actual = writer.write(dailyReport);

        expect(actual).toBe(expected);
      });
    });
  });
});
