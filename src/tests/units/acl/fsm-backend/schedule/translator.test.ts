import { Reader, Translator } from 'acl/fsm-backend/schedule/delegate';
import { Builder } from 'tests/factories';
import { ScheduleFactory } from 'tests/factories/domains/schedule';
import { SchedulesMedia, ScheduleMedia } from 'tests/mock/upstreams/fcm-backend/media';

describe('Package translator', () => {
  describe('Class Translator', () => {
    describe('instantiate', () => {
      it('success', () => {
        const translator = new Translator();

        expect(translator).toBeInstanceOf(Translator);
      });
    });

    describe('translate', () => {
      it('successfully returns schedules.', () => {
        const expecteds = Builder.get(ScheduleFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const media = new SchedulesMedia(expecteds);

        const translator = new Translator();

        const reader = new Reader();

        const actuals = translator.translate(reader.read(media.createSuccessfulContent()));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameSchedule(expected);
        });
      });
    });

    describe('translateEntry', () => {
      it('successfully returns schedule.', () => {
        const expected = Builder.get(ScheduleFactory).build();

        const media = new ScheduleMedia(expected);

        const translator = new Translator();

        const reader = new Reader();

        const actual = translator.translateEntry(reader.readEntry(media.createSuccessfulContent()));

        expect(actual).toBeSameSchedule(expected);
      });
    });
  });
});
