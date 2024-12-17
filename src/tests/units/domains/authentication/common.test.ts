import { Authentication, AuthenticationIdentifier, TokenType } from 'domains/authentication';
import { Builder } from 'tests/factories';
import {
  AuthenticationIdentifierFactory,
  TokenFactory,
} from 'tests/factories/domains/authentication';
import { UserIdentifierFactory } from 'tests/factories/domains/user';

import { UniversallyUniqueIdentifierTest } from '../common/identifier';

describe('Package common', () => {
  describe('Class AuthenticationIdentifier', () => {
    UniversallyUniqueIdentifierTest(AuthenticationIdentifier);
  });

  describe('Class Authentication', () => {
    type Properties = ConstructorParameters<typeof Authentication>;

    const generator = (): Properties => [
      Builder.get(AuthenticationIdentifierFactory).build(),
      Builder.get(UserIdentifierFactory).build(),
      Builder.get(TokenFactory).build({ type: TokenType.ACCESS }),
      Builder.get(TokenFactory).build({ type: TokenType.REFRESH }),
    ];

    describe('instantiation', () => {
      const props = generator();

      it.each<Array<Properties>>([
        [[props[0], props[1], props[2], props[3]]],
        [[props[0], props[1], props[2], null]],
        [[props[0], props[1], null, props[3]]],
        [[props[0], props[1], null, null]],
      ])('success.', (props) => {
        const instance = new Authentication(...props);

        expect(instance).toBeInstanceOf(Authentication);
        expect(instance.identifier).toBe(props[0]);
        expect(instance.user).toBe(props[1]);
        expect(instance.accessToken).toBe(props[2]);
        expect(instance.refreshToken).toBe(props[3]);
      });

      it.each([
        { accessToken: Builder.get(TokenFactory).build({ type: TokenType.REFRESH }) },
        { refreshToken: Builder.get(TokenFactory).build({ type: TokenType.ACCESS }) },
      ])(`fails with invalid value.`, (invalid) => {
        const validProps = generator();

        const props = {
          identifier: validProps[0],
          user: validProps[1],
          accessToken: validProps[2],
          refreshToken: validProps[3],
          ...invalid,
        };

        expect(
          () =>
            new Authentication(props.identifier, props.user, props.accessToken, props.refreshToken)
        ).toThrow();
      });
    });

    describe('isExpired', () => {
      it.each([
        {
          accessToken: Builder.get(TokenFactory).build({
            type: TokenType.ACCESS,
            expiresAt: new Date(Date.now() - 1000),
          }),
          type: TokenType.ACCESS,
          expected: true,
        },
        {
          accessToken: Builder.get(TokenFactory).build({
            type: TokenType.ACCESS,
            expiresAt: new Date(Date.now() + 1000),
          }),
          type: TokenType.ACCESS,
          expected: false,
        },
        {
          refreshToken: Builder.get(TokenFactory).build({
            type: TokenType.REFRESH,
            expiresAt: new Date(Date.now() - 1000),
          }),
          type: TokenType.REFRESH,
          expected: true,
        },
        {
          refreshToken: Builder.get(TokenFactory).build({
            type: TokenType.REFRESH,
            expiresAt: new Date(Date.now() + 1000),
          }),
          type: TokenType.REFRESH,
          expected: false,
        },
      ])('returns boolean with %s', (values) => {
        const props = generator();

        const args = {
          identifier: props[0],
          user: props[1],
          accessToken: props[2],
          refreshToken: props[3],
          ...values,
        };

        const instance = new Authentication(
          args.identifier,
          args.user,
          args.accessToken,
          args.refreshToken
        );

        expect(instance.isExpired(values.type)).toBe(values.expected);
      });
    });
  });
});
