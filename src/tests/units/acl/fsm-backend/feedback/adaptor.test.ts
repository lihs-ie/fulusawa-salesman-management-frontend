import HttpError from 'http-errors';
import fetchMock from 'jest-fetch-mock';

import { Adaptor, Reader, Translator, Writer } from 'acl/fsm-backend/feedback/delegate';
import { HttpMethod } from 'aspects/http';
import { Builder } from 'tests/factories';
import {
  FeedbackFactory,
  FeedbackIdentifierFactory,
  CriteriaFactory,
} from 'tests/factories/domains/feedback';
import { Type } from 'tests/mock/upstreams/common';
import { prepare } from 'tests/mock/upstreams/fcm-backend';

import { AdaptorFailureTest } from '../../common';

const endpoint = 'http://localhost/api';

const createAdaptor = () => new Adaptor(endpoint, new Writer(), new Reader(), new Translator());

describe('Package adaptor', () => {
  describe('Class Adaptor', () => {
    beforeEach(() => {
      fetchMock.enableMocks();
    });

    afterEach(() => {
      fetchMock.resetMocks();
      fetchMock.disableMocks();
    });

    describe('instantiate', () => {
      it('success', () => {
        const adaptor = new Adaptor(endpoint, new Writer(), new Reader(), new Translator());

        expect(adaptor).toBeInstanceOf(Adaptor);
      });
    });

    describe('add', () => {
      it('successfully persist feedback.', async () => {
        const adaptor = createAdaptor();

        const feedback = Builder.get(FeedbackFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addFeedbackPersist(Type.OK, HttpMethod.POST, feedback)
        );

        await adaptor.add(feedback);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const feedback = Builder.get(FeedbackFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().add(feedback),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addFeedbackPersist(type, HttpMethod.POST, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          feedback
        );
      });
    });

    describe('update', () => {
      it('successfully update feedback.', async () => {
        const adaptor = createAdaptor();

        const feedback = Builder.get(FeedbackFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addFeedbackPersist(Type.OK, HttpMethod.PUT, feedback)
        );

        await adaptor.update(feedback);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const feedback = Builder.get(FeedbackFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().update(feedback),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addFeedbackPersist(type, HttpMethod.PUT, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          feedback
        );
      });
    });

    describe('find', () => {
      it('successfully returns feedback.', async () => {
        const adaptor = createAdaptor();

        const feedback = Builder.get(FeedbackFactory).build();

        prepare(endpoint, (upstream) => upstream.addFeedbackFind(Type.OK, feedback));

        const actual = await adaptor.find(feedback.identifier);

        expect(actual).toBeSameFeedback(feedback);
      });

      describe('unsuccessfully', () => {
        const feedback = Builder.get(FeedbackFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().find(feedback.identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addFeedbackFind(type, overrides)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          feedback
        );
      });
    });

    describe('list', () => {
      it.each([
        Builder.get(CriteriaFactory).build(),
        Builder.get(CriteriaFactory).build({ fulfilled: true }),
      ])('successfully returns cemeteries.', async (criteria) => {
        const adaptor = createAdaptor();

        const expecteds = Builder.get(FeedbackFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        prepare(endpoint, (upstream) =>
          upstream.addFeedbackList(Type.OK, { model: expecteds, identifier: criteria })
        );

        const actuals = await adaptor.list(criteria);

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameFeedback(expected);
        });
      });

      describe('unsuccessfully', () => {
        const criteria = Builder.get(CriteriaFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().list(criteria),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addFeedbackList(type, { identifier: overrides })
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          criteria
        );
      });
    });

    describe('remove', () => {
      it('successfully remove feedback.', async () => {
        const adaptor = createAdaptor();

        const identifier = Builder.get(FeedbackIdentifierFactory).build();

        prepare(endpoint, (upstream) => upstream.addFeedbackDelete(Type.OK, identifier));

        await adaptor.delete(identifier);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const identifier = Builder.get(FeedbackIdentifierFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().delete(identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addFeedbackDelete(type, overrides)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          identifier
        );
      });
    });
  });
});
