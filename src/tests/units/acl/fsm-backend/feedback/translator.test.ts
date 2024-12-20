import { Reader, Translator } from 'acl/fsm-backend/feedback/delegate';
import { Builder } from 'tests/factories';
import { FeedbackFactory } from 'tests/factories/domains/feedback';
import { FeedbacksMedia, FeedbackMedia } from 'tests/mock/upstreams/fcm-backend/media';

describe('Package translator', () => {
  describe('Class Translator', () => {
    describe('instantiate', () => {
      it('success', () => {
        const translator = new Translator();

        expect(translator).toBeInstanceOf(Translator);
      });
    });

    describe('translate', () => {
      it('successfully returns feedbacks.', () => {
        const expecteds = Builder.get(FeedbackFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const media = new FeedbacksMedia(expecteds);

        const translator = new Translator();

        const reader = new Reader();

        const actuals = translator.translate(reader.read(media.createSuccessfulContent()));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameFeedback(expected);
        });
      });
    });

    describe('translateEntry', () => {
      it('successfully returns feedback.', () => {
        const expected = Builder.get(FeedbackFactory).build();

        const media = new FeedbackMedia(expected);

        const translator = new Translator();

        const reader = new Reader();

        const actual = translator.translateEntry(reader.readEntry(media.createSuccessfulContent()));

        expect(actual).toBeSameFeedback(expected);
      });
    });
  });
});
