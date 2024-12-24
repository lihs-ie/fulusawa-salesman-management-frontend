import HttpError from 'http-errors';
import fetchMock from 'jest-fetch-mock';

import { Adaptor, Reader, Translator, Writer } from 'acl/fsm-backend/visit/delegate';
import { HttpMethod } from 'aspects/http';
import { Builder } from 'tests/factories';
import {
  VisitFactory,
  VisitIdentifierFactory,
  CriteriaFactory,
} from 'tests/factories/domains/visit';
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
      it('successfully persist visit.', async () => {
        const adaptor = createAdaptor();

        const visit = Builder.get(VisitFactory).build();

        prepare(endpoint, (upstream) => upstream.addVisitPersist(Type.OK, HttpMethod.POST, visit));

        await adaptor.add(visit);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const visit = Builder.get(VisitFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().add(visit),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addVisitPersist(type, HttpMethod.POST, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          visit
        );
      });
    });

    describe('update', () => {
      it('successfully update visit.', async () => {
        const adaptor = createAdaptor();

        const visit = Builder.get(VisitFactory).build();

        prepare(endpoint, (upstream) => upstream.addVisitPersist(Type.OK, HttpMethod.PUT, visit));

        await adaptor.update(visit);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const visit = Builder.get(VisitFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().update(visit),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addVisitPersist(type, HttpMethod.PUT, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          visit
        );
      });
    });

    describe('find', () => {
      it('successfully returns visit.', async () => {
        const adaptor = createAdaptor();

        const visit = Builder.get(VisitFactory).build();

        prepare(endpoint, (upstream) => upstream.addVisitFind(Type.OK, visit));

        const actual = await adaptor.find(visit.identifier);

        expect(actual).toBeSameVisit(visit);
      });

      describe('unsuccessfully', () => {
        const visit = Builder.get(VisitFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().find(visit.identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addVisitFind(type, overrides)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          visit
        );
      });
    });

    describe('list', () => {
      it.each([
        Builder.get(CriteriaFactory).build(),
        Builder.get(CriteriaFactory).build({ fulfilled: true }),
      ])('successfully returns cemeteries.', async (criteria) => {
        const adaptor = createAdaptor();

        const expecteds = Builder.get(VisitFactory).buildList(Math.floor(Math.random() * 10) + 1);

        prepare(endpoint, (upstream) =>
          upstream.addVisitList(Type.OK, { model: expecteds, identifier: criteria })
        );

        const actuals = await adaptor.list(criteria);

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameVisit(expected);
        });
      });

      describe('unsuccessfully', () => {
        const criteria = Builder.get(CriteriaFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().list(criteria),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addVisitList(type, { identifier: overrides })),
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
      it('successfully remove visit.', async () => {
        const adaptor = createAdaptor();

        const identifier = Builder.get(VisitIdentifierFactory).build();

        prepare(endpoint, (upstream) => upstream.addVisitDelete(Type.OK, identifier));

        await adaptor.delete(identifier);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const identifier = Builder.get(VisitIdentifierFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().delete(identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addVisitDelete(type, overrides)),
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
