import { Reader, Writer } from 'acl/fsm-backend/authentication/delegate';
import { Builder } from 'tests/factories';
import {
  AuthenticationIdentifierFactory,
  TokenFactory,
} from 'tests/factories/domains/authentication';
import { MailAddressFactory } from 'tests/factories/domains/common/contact';
import { PasswordFactory } from 'tests/factories/domains/user';
import { AuthenticationMedia, IntrospectionMedia } from 'tests/mock/upstreams/fcm-backend/media';

describe('Package media-types', () => {
  describe('Class Reader', () => {
    describe('instantiate', () => {
      it('success', () => {
        const reader = new Reader();

        expect(reader).toBeInstanceOf(Reader);
      });
    });

    describe('read', () => {
      it('successfully returns entry media.', () => {
        const reader = new Reader();

        const source = new AuthenticationMedia();

        const expected = source.data();

        const actuals = reader.read(source.createSuccessfulContent());

        expect(actuals).toBeExpectedAuthenticationMedia(expected);
      });
    });

    describe('readIntrospection', () => {
      it('successfully returns introspection media.', () => {
        const reader = new Reader();

        const source = new IntrospectionMedia();

        const expected = source.data();

        const actual = reader.readIntrospection(source.createSuccessfulContent());

        expect(actual).toBeExpectedIntrospectionMedia(expected);
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
      it('successfully returns entry media.', () => {
        const writer = new Writer();

        const email = Builder.get(MailAddressFactory).build();
        const password = Builder.get(PasswordFactory).build();
        const identifier = Builder.get(AuthenticationIdentifierFactory).build();

        const expected = JSON.stringify({
          identifier: identifier.value,
          email: email.toString(),
          password: password.value,
        });

        const actual = writer.write([identifier, email, password]);

        expect(actual).toBe(expected);
      });
    });

    describe('writeLogout', () => {
      it('successfully returns introspection media.', () => {
        const writer = new Writer();

        const identifier = Builder.get(AuthenticationIdentifierFactory).build();

        const expected = JSON.stringify({
          identifier: identifier.value,
        });

        const actual = writer.writeLogout(identifier);

        expect(actual).toBe(expected);
      });
    });

    describe('writeToken', () => {
      it('successfully returns introspection media.', () => {
        const writer = new Writer();

        const token = Builder.get(TokenFactory).build();

        const expected = JSON.stringify({
          value: token.value,
          type: token.type,
        });

        const actual = writer.writeToken(token.value, token.type);

        expect(actual).toBe(expected);
      });
    });
  });
});
