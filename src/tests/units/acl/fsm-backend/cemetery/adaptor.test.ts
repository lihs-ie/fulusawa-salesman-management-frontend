import HttpError from 'http-errors';
import fetchMock from 'jest-fetch-mock';

import { Adaptor, Reader, Translator, Writer } from 'acl/fsm-backend/cemetery/delegate';
import { HttpMethod } from 'aspects/http';
import { Builder } from 'tests/factories';
import {
  CemeteryFactory,
  CemeteryIdentifierFactory,
  CriteriaFactory,
} from 'tests/factories/domains/cemetery';
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
      it('successfully persist cemetery.', async () => {
        const adaptor = createAdaptor();

        const cemetery = Builder.get(CemeteryFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addCemeteryPersist(Type.OK, HttpMethod.POST, cemetery)
        );

        await adaptor.add(cemetery);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const cemetery = Builder.get(CemeteryFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().add(cemetery),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addCemeteryPersist(type, HttpMethod.POST, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          cemetery
        );
      });
    });

    describe('update', () => {
      it('successfully update cemetery.', async () => {
        const adaptor = createAdaptor();

        const cemetery = Builder.get(CemeteryFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addCemeteryPersist(Type.OK, HttpMethod.PUT, cemetery)
        );

        await adaptor.update(cemetery);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const cemetery = Builder.get(CemeteryFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().update(cemetery),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addCemeteryPersist(type, HttpMethod.PUT, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          cemetery
        );
      });
    });

    describe('find', () => {
      it('successfully returns cemetery.', async () => {
        const adaptor = createAdaptor();

        const cemetery = Builder.get(CemeteryFactory).build();

        prepare(endpoint, (upstream) => upstream.addCemeteryFind(Type.OK, cemetery));

        const actual = await adaptor.find(cemetery.identifier);

        expect(actual).toBeSameCemetery(cemetery);
      });

      describe('unsuccessfully', () => {
        const cemetery = Builder.get(CemeteryFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().find(cemetery.identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addCemeteryFind(type, overrides)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          cemetery
        );
      });
    });

    describe('list', () => {
      it.each([
        Builder.get(CriteriaFactory).build(),
        Builder.get(CriteriaFactory).build({ fulfilled: true }),
      ])('successfully returns cemeteries.', async (criteria) => {
        const adaptor = createAdaptor();

        const expecteds = Builder.get(CemeteryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        prepare(endpoint, (upstream) =>
          upstream.addCemeteryList(Type.OK, { model: expecteds, identifier: criteria })
        );

        const actuals = await adaptor.list(criteria);

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameCemetery(expected);
        });
      });

      describe('unsuccessfully', () => {
        const criteria = Builder.get(CriteriaFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().list(criteria),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addCemeteryList(type, { identifier: overrides })
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
      it('successfully remove cemetery.', async () => {
        const adaptor = createAdaptor();

        const identifier = Builder.get(CemeteryIdentifierFactory).build();

        prepare(endpoint, (upstream) => upstream.addCemeteryDelete(Type.OK, identifier));

        await adaptor.delete(identifier);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const identifier = Builder.get(CemeteryIdentifierFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().delete(identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addCemeteryDelete(type, overrides)),
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
