import { Reader, Translator } from 'acl/fsm-backend/daily-report/delegate';
import { Builder } from 'tests/factories';
import { DailyReportFactory } from 'tests/factories/domains/daily-report';
import { DailyReportsMedia, DailyReportMedia } from 'tests/mock/upstreams/fcm-backend/media';

describe('Package translator', () => {
  describe('Class Translator', () => {
    describe('instantiate', () => {
      it('success', () => {
        const translator = new Translator();

        expect(translator).toBeInstanceOf(Translator);
      });
    });

    describe('translate', () => {
      it('successfully returns daily-reports.', () => {
        const expecteds = Builder.get(DailyReportFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const media = new DailyReportsMedia(expecteds);

        const translator = new Translator();

        const reader = new Reader();

        const actuals = translator.translate(reader.read(media.createSuccessfulContent()));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameDailyReport(expected);
        });
      });
    });

    describe('translateEntry', () => {
      it('successfully returns daily-report.', () => {
        const expected = Builder.get(DailyReportFactory).build();

        const media = new DailyReportMedia(expected);

        const translator = new Translator();

        const reader = new Reader();

        const actual = translator.translateEntry(reader.readEntry(media.createSuccessfulContent()));

        expect(actual).toBeSameDailyReport(expected);
      });
    });
  });
});
