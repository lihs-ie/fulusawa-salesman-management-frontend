import { List } from 'immutable';

import { Reader, Writer } from 'acl/fsm-backend/feedback/delegate';
import { Builder } from 'tests/factories';
import { FeedbackFactory } from 'tests/factories/domains/feedback';
import { FeedbacksMedia, FeedbackMedia } from 'tests/mock/upstreams/fcm-backend/media';

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
        const media = new FeedbacksMedia();

        const expecteds = media.data();

        const reader = new Reader();

        const actuals = reader.read(media.createSuccessfulContent());

        List(expecteds.feedbacks)
          .zip(actuals.entries)
          .forEach(([expected, actual]) => {
            expect(actual).toBeExpectedFeedbackMedia(expected);
          });
      });
    });

    describe('readEntry', () => {
      it('successfully returns entry media.', () => {
        const media = new FeedbackMedia();

        const expected = media.data();

        const reader = new Reader();

        const actual = reader.readEntry(media.createSuccessfulContent());

        expect(actual).toBeExpectedFeedbackMedia(expected);
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
      it('successfully returns serialized feedback.', () => {
        const feedback = Builder.get(FeedbackFactory).build();

        const expected = JSON.stringify({
          identifier: feedback.identifier.value,
          type: feedback.type,
          status: feedback.status,
          content: feedback.content,
          createdAt: feedback.createdAt.toISOString(),
          updatedAt: feedback.updatedAt.toISOString(),
        });

        const writer = new Writer();

        const actual = writer.write(feedback);

        expect(actual).toBe(expected);
      });
    });
  });
});
