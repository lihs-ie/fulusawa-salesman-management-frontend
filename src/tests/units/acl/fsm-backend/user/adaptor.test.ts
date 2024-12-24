import HttpError from 'http-errors';
import fetchMock from 'jest-fetch-mock';

import { Adaptor, Reader, Translator, Writer } from 'acl/fsm-backend/user/delegate';
import { HttpMethod } from 'aspects/http';
import { Builder } from 'tests/factories';
import { UserFactory, UserIdentifierFactory } from 'tests/factories/domains/user';
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
      it('successfully persist user.', async () => {
        const adaptor = createAdaptor();

        const user = Builder.get(UserFactory).build();

        prepare(endpoint, (upstream) => upstream.addUserPersist(Type.OK, HttpMethod.POST, user));

        await adaptor.add(user);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const user = Builder.get(UserFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().add(user),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addUserPersist(type, HttpMethod.POST, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          user
        );
      });
    });

    describe('update', () => {
      it('successfully update user.', async () => {
        const adaptor = createAdaptor();

        const user = Builder.get(UserFactory).build();

        prepare(endpoint, (upstream) => upstream.addUserPersist(Type.OK, HttpMethod.PUT, user));

        await adaptor.update(user);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const user = Builder.get(UserFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().update(user),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addUserPersist(type, HttpMethod.PUT, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          user
        );
      });
    });

    describe('find', () => {
      it('successfully returns user.', async () => {
        const adaptor = createAdaptor();

        const user = Builder.get(UserFactory).build();

        prepare(endpoint, (upstream) => upstream.addUserFind(Type.OK, user));

        const actual = await adaptor.find(user.identifier);

        expect(actual).toBeSameUser(user);
      });

      describe('unsuccessfully', () => {
        const user = Builder.get(UserFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().find(user.identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addUserFind(type, overrides)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          user
        );
      });
    });

    describe('list', () => {
      it('successfully returns users.', async () => {
        const adaptor = createAdaptor();

        const expecteds = Builder.get(UserFactory).buildList(Math.floor(Math.random() * 10) + 1);

        prepare(endpoint, (upstream) => upstream.addUserList(Type.OK, expecteds));

        const actuals = await adaptor.list();

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameUser(expected);
        });
      });

      describe('unsuccessfully', () => {
        const users = Builder.get(UserFactory).buildList(Math.floor(Math.random() * 10) + 1);

        AdaptorFailureTest(
          () => createAdaptor().list(),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addUserList(type, overrides)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          users
        );
      });
    });

    describe('remove', () => {
      it('successfully remove user.', async () => {
        const adaptor = createAdaptor();

        const identifier = Builder.get(UserIdentifierFactory).build();

        prepare(endpoint, (upstream) => upstream.addUserDelete(Type.OK, identifier));

        await adaptor.delete(identifier);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const identifier = Builder.get(UserIdentifierFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().delete(identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addUserDelete(type, overrides)),
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
