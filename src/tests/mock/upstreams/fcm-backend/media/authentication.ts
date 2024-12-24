import { v7 as uuid } from 'uuid';

import {
  EntryMedia,
  RawEntryMedia,
  IntrospectionMedia as RawIntrospectionMedia,
} from 'acl/fsm-backend/authentication/templates';
import { Authentication, TokenType } from 'domains/authentication';
import { Builder } from 'tests/factories';
import { TokenFactory } from 'tests/factories/domains/authentication';

import { Media } from '../../common';

export class AuthenticationMedia extends Media<Partial<RawEntryMedia>, Authentication> {
  public createSuccessfulContent(): string {
    return JSON.stringify(this._data);
  }

  public createFailureContent(): string {
    return JSON.stringify({
      errors: [
        {
          reason: 101,
          cause: 'unit',
          value: 'sku099',
        },
      ],
    });
  }

  protected fillByModel(overrides: Authentication): RawEntryMedia {
    return {
      identifier: overrides.identifier.value,
      user: overrides.user.value,
      accessToken: overrides.accessToken
        ? {
            type: overrides.accessToken.type,
            value: overrides.accessToken.value,
            expiresAt: overrides.accessToken.expiresAt.toISOString(),
          }
        : null,
      refreshToken: overrides.refreshToken
        ? {
            type: overrides.refreshToken.type,
            value: overrides.refreshToken.value,
            expiresAt: overrides.refreshToken.expiresAt.toISOString(),
          }
        : null,
    };
  }

  protected fill(overrides?: Partial<RawEntryMedia> | Authentication): RawEntryMedia {
    if (overrides instanceof Authentication) {
      return this.fillByModel(overrides);
    }

    const accessToken = Builder.get(TokenFactory).build({
      type: TokenType.ACCESS,
      expiresAt: new Date(1000),
    });

    const refreshToken = Builder.get(TokenFactory).build({
      type: TokenType.REFRESH,
      expiresAt: new Date(1000),
    });

    return {
      identifier: uuid(),
      user: uuid(),
      accessToken: {
        type: accessToken.type,
        value: accessToken.value,
        expiresAt: accessToken.expiresAt.toISOString(),
      },
      refreshToken: {
        type: refreshToken.type,
        value: refreshToken.value,
        expiresAt: refreshToken.expiresAt.toISOString(),
      },
      ...overrides,
    };
  }
}

export class IntrospectionMedia extends Media<Partial<RawIntrospectionMedia>, {}> {
  public createSuccessfulContent(): string {
    return JSON.stringify(this._data);
  }

  public createFailureContent(): string {
    return JSON.stringify({
      errors: [
        {
          reason: 101,
          cause: 'unit',
          value: 'sku099',
        },
      ],
    });
  }

  protected fill(overrides?: Partial<RawIntrospectionMedia>): RawIntrospectionMedia {
    return {
      active: Math.random() < 0.5,
      ...overrides,
    };
  }

  protected fillByModel(_: {}): RawIntrospectionMedia {
    return this.fill();
  }
}

expect.extend({
  toBeExpectedIntrospectionMedia(actual: RawIntrospectionMedia, expected: RawIntrospectionMedia) {
    try {
      expect(actual.active).toBe(expected.active);

      return {
        message: () => 'OK',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => (error as Error).message,
        pass: false,
      };
    }
  },
  toBeExpectedTokenMedia(
    actual: EntryMedia['accessToken' | 'refreshToken'],
    expected: RawEntryMedia['accessToken' | 'refreshToken']
  ) {
    try {
      if (!expected) {
        expect(actual).toBeNull();
      } else {
        expect(actual!.type).toBe(expected.type);
        expect(actual!.value).toBe(expected.value);
        expect(actual!.expiresAt.toISOString()).toBe(expected.expiresAt);
      }

      return {
        message: () => 'OK',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => (error as Error).message,
        pass: false,
      };
    }
  },
  toBeExpectedAuthenticationMedia(actual: EntryMedia, expected: RawEntryMedia) {
    try {
      expect(actual.identifier).toBe(expected.identifier);
      expect(actual.user).toBe(expected.user);
      expect(actual.accessToken).toBeExpectedTokenMedia(expected.accessToken);
      expect(actual.refreshToken).toBeExpectedTokenMedia(expected.refreshToken);

      return {
        message: () => 'OK',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => (error as Error).message,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeExpectedIntrospectionMedia(expected: RawIntrospectionMedia): R;
      toBeExpectedTokenMedia(expected: RawEntryMedia['accessToken' | 'refreshToken']): R;
      toBeExpectedAuthenticationMedia(expected: RawEntryMedia): R;
    }
  }
}
