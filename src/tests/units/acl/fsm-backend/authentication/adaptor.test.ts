import HttpError from 'http-errors';
import fetchMock from 'jest-fetch-mock';

import { Adaptor, Writer, Reader, Translator } from 'acl/fsm-backend/authentication/delegate';
import { Builder } from 'tests/factories';
import { AuthenticationFactory, TokenFactory } from 'tests/factories/domains/authentication';
import { MailAddressFactory } from 'tests/factories/domains/common/contact';
import { PasswordFactory } from 'tests/factories/domains/user';
import { Type } from 'tests/mock/upstreams/common';
import { prepare } from 'tests/mock/upstreams/fcm-backend';

import { AdaptorFailureTest } from '../../common';

describe('Package adaptor', () => {
  describe('Class Adaptor', () => {
    beforeEach(() => {
      fetchMock.enableMocks();
    });

    afterEach(() => {
      fetchMock.resetMocks();
      fetchMock.disableMocks();
    });

    const endpoint = 'http://localhost/api';
    const createAdaptor = () => new Adaptor(endpoint, new Writer(), new Reader(), new Translator());

    describe('instantiate', () => {
      it('success', () => {
        const adaptor = new Adaptor(endpoint, new Writer(), new Reader(), new Translator());

        expect(adaptor).toBeInstanceOf(Adaptor);
      });
    });

    describe('login', () => {
      it('successfully returns authentication.', async () => {
        const email = Builder.get(MailAddressFactory).build();
        const password = Builder.get(PasswordFactory).build();
        const authentication = Builder.get(AuthenticationFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addLogin(Type.OK, {
            model: authentication,
            resource: { email, password, identifier: authentication.identifier },
          })
        );

        const adaptor = createAdaptor();

        const actual = await adaptor.login(authentication.identifier, email, password);

        expect(actual).toBeSameAuthentication(authentication);
      });

      describe('unsuccessfully', () => {
        const email = Builder.get(MailAddressFactory).build();
        const password = Builder.get(PasswordFactory).build();
        const authentication = Builder.get(AuthenticationFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().login(authentication.identifier, email, password),
          (type, overrides) => prepare(endpoint, (upstream) => upstream.addLogin(type, overrides!)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          {
            model: authentication,
            resource: { email, password, identifier: authentication.identifier },
          }
        );
      });
    });

    describe('logout', () => {
      it('successfully returns successful-response.', async () => {
        const identifier = Builder.get(AuthenticationFactory).build().identifier;

        prepare(endpoint, (upstream) => upstream.addLogout(Type.OK, { identifier }));

        const adaptor = createAdaptor();

        await adaptor.logout(identifier);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const identifier = Builder.get(AuthenticationFactory).build().identifier;

        AdaptorFailureTest(
          () => createAdaptor().logout(identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addLogout(type, overrides!)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          { identifier }
        );
      });
    });

    describe('introspect', () => {
      it('successfully returns successful-response.', async () => {
        const token = Builder.get(TokenFactory).build();

        const expected = Math.random() < 0.5;

        prepare(endpoint, (upstream) =>
          upstream.addIntrospection(Type.OK, { identifier: token, active: expected })
        );

        const adaptor = createAdaptor();

        const actual = await adaptor.introspect(token.value, token.type);

        expect(actual).toBe(expected);
      });

      describe('unsuccessfully', () => {
        const token = Builder.get(TokenFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().introspect(token.value, token.type),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addIntrospection(type, overrides!)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          { identifier: token }
        );
      });
    });

    describe('refresh', () => {
      it('successfully returns authentication.', async () => {
        const refreshToken = Builder.get(TokenFactory).build({
          type: 'REFRESH',
          expiresAt: new Date(1000),
        });

        const authentication = Builder.get(AuthenticationFactory).build({
          refreshToken,
        });

        prepare(endpoint, (upstream) =>
          upstream.addRefresh(Type.OK, {
            model: authentication,
            resource: refreshToken.value,
          })
        );

        const adaptor = createAdaptor();

        const actual = await adaptor.refresh(refreshToken.value);

        expect(actual).toBeSameAuthentication(authentication);
      });

      describe('unsuccessfully', () => {
        const refreshToken = Builder.get(TokenFactory).build({
          type: 'REFRESH',
          expiresAt: new Date(1000),
        });

        const authentication = Builder.get(AuthenticationFactory).build({
          refreshToken,
        });

        AdaptorFailureTest(
          () => createAdaptor().refresh(refreshToken.value),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addRefresh(type, overrides!)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          {
            model: authentication,
            resource: refreshToken.value,
          }
        );
      });
    });

    // describe('revoke', () => {
    //   it('successfully returns successful-response.', async () => {
    //     const accessToken = Builder.get(TokenFactory).build({ type: TokenType.ACCESS });
    //     const refreshToken = Builder.get(TokenFactory).build({ type: TokenType.REFRESH });

    //     const resourceOverrides = {
    //       accessToken: accessToken.value,
    //       refreshToken: refreshToken.value,
    //     };

    //     prepare(endpoint, (upstream) =>
    //       upstream.addRevoke(Type.OK, { resource: resourceOverrides })
    //     );

    //     const adaptor = createAdaptor();

    //     await adaptor.revoke(accessToken.value, accessToken.type);

    //     await adaptor.revoke(refreshToken.value, refreshToken.type);

    //     expect(fetchMock).toHaveBeenCalledTimes(2);
    //   });
    // });
  });
});
