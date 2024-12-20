import { List, Map } from 'immutable';

import {
  Authentication,
  AuthenticationIdentifier,
  Repository,
  Token,
  TokenType,
} from 'domains/authentication';
import { MailAddress } from 'domains/common';
import { Password } from 'domains/user';
import { UserIdentifier } from 'domains/user/common';

import { Builder, Factory } from '../../common';
import { UniversallyUniqueIdentifierFactory } from '../common';
import { UserIdentifierFactory } from '../user';

import { TokenFactory } from './token';

export class AuthenticationIdentifierFactory extends UniversallyUniqueIdentifierFactory(
  AuthenticationIdentifier
) {}

export type AuthenticationProperties = {
  identifier: AuthenticationIdentifier;
  user: UserIdentifier;
  accessToken: Token | null;
  refreshToken: Token | null;
  expired?: {
    access: boolean;
    refresh: boolean;
  };
};

export class AuthenticationFactory extends Factory<Authentication, AuthenticationProperties> {
  protected instantiate(properties: AuthenticationProperties): Authentication {
    return new Authentication(
      properties.identifier,
      properties.user,
      properties.accessToken,
      properties.refreshToken
    );
  }

  protected prepare(
    overrides: Partial<AuthenticationProperties>,
    seed: number
  ): AuthenticationProperties {
    return {
      identifier: Builder.get(AuthenticationIdentifierFactory).buildWith(seed),
      user: Builder.get(UserIdentifierFactory).buildWith(seed),
      accessToken: overrides.expired?.access
        ? null
        : Builder.get(TokenFactory).buildWith(seed, {
            type: TokenType.ACCESS,
            expiresAt: new Date(Math.floor(seed / 1000) + 1000),
          }),
      refreshToken: overrides.expired?.refresh
        ? null
        : Builder.get(TokenFactory).buildWith(seed, {
            type: TokenType.REFRESH,
            expiresAt: new Date(Math.floor(seed / 1000) + 2000),
          }),
      ...overrides,
    };
  }

  protected retrieve(instance: Authentication): AuthenticationProperties {
    return {
      identifier: instance.identifier,
      user: instance.user,
      accessToken: instance.accessToken,
      refreshToken: instance.refreshToken,
    };
  }
}

export type RepositoryProperties = {
  instances: List<Authentication>;
  onRevoke?: (instance: Authentication) => void;
  onRemove?: (instances: List<Authentication>) => void;
};

export class RepositoryFactory extends Factory<Repository, RepositoryProperties> {
  protected instantiate(properties: RepositoryProperties): Repository {
    return new (class extends Repository {
      private instances: Map<AuthenticationIdentifier, Authentication>;

      public constructor(
        instances: List<Authentication>,
        private readonly onRevoke?: (instance: Authentication) => void,
        private readonly onRemove?: (instances: List<Authentication>) => void
      ) {
        super();

        this.instances = instances.toMap().mapKeys((_, instance) => instance.identifier);
      }

      public async login(
        identifier: AuthenticationIdentifier,
        email: MailAddress,
        password: Password
      ): Promise<Authentication> {
        if (this.instances.has(identifier)) {
          throw new Error('Already logged in');
        }

        const instance = Builder.get(AuthenticationFactory).build({
          identifier,
          user: Builder.get(UserIdentifierFactory).build(),
          accessToken: Builder.get(TokenFactory).build({ type: TokenType.ACCESS }),
          refreshToken: Builder.get(TokenFactory).build({ type: TokenType.REFRESH }),
        });

        this.instances = this.instances.set(identifier, instance);

        return instance;
      }

      public async logout(identifier: AuthenticationIdentifier): Promise<void> {
        if (!this.instances.has(identifier)) {
          throw new Error('Not logged in');
        }

        this.instances = this.instances.delete(identifier);

        this.onRemove?.(this.instances.toList());
      }

      public async refresh(value: string): Promise<Authentication> {
        const instance = this.instances.find((instance) => instance.refreshToken?.value === value);

        if (!instance) {
          throw new Error('Invalid token');
        }

        return Builder.get(AuthenticationFactory).duplicate(instance, {
          accessToken: Builder.get(TokenFactory).build({
            type: TokenType.ACCESS,
            expiresAt: new Date(3000),
          }),
        });
      }

      public async revoke(value: string, type: TokenType): Promise<void> {
        const instance = this.instances.find((instance) => {
          if (type === TokenType.ACCESS) {
            return instance.accessToken?.value === value;
          }

          return instance.refreshToken?.value === value;
        });

        if (!instance) {
          throw new Error('Invalid token');
        }

        const next = Builder.get(AuthenticationFactory).duplicate(
          instance,
          type === TokenType.ACCESS ? { accessToken: null } : { refreshToken: null }
        );

        this.instances = this.instances.set(instance.identifier, next);

        this.onRevoke?.(instance);
      }

      public async introspection(value: string, type: TokenType): Promise<boolean> {
        const target = this.instances.find((instance) => {
          if (type === TokenType.ACCESS) {
            return instance.accessToken?.value === value;
          }

          return instance.refreshToken?.value === value;
        });

        if (!target) {
          return false;
        }

        if (type === TokenType.ACCESS) {
          if (!target.accessToken) {
            return false;
          }

          return target.accessToken.expiresAt > new Date();
        } else {
          if (!target.refreshToken) {
            return false;
          }

          return target.refreshToken.expiresAt > new Date();
        }
      }
    })(properties.instances, properties.onRevoke, properties.onRemove);
  }

  protected prepare(overrides: Partial<RepositoryProperties>, seed: number): RepositoryProperties {
    return {
      instances: Builder.get(AuthenticationFactory).buildListWith(10, seed),
      ...overrides,
    };
  }

  protected retrieve(_: Repository): RepositoryProperties {
    throw new Error('Repository cannot be retrieved.');
  }
}

expect.extend({
  toBeSameAuthentication(actual: Authentication, expected: Authentication) {
    try {
      expect(actual.identifier).toEqualValueObject(expected.identifier);
      expect(actual.user).toEqualValueObject(expected.user);
      expect(actual.accessToken).toBeNullOr(
        expected.accessToken,
        (expectedAccessToken, actualAccessToken) =>
          expect(actualAccessToken).toEqualValueObject(expectedAccessToken)
      );
      expect(actual.refreshToken).toBeNullOr(
        expected.refreshToken,
        (expectedRefreshToken, actualRefreshToken) =>
          expect(actualRefreshToken).toEqualValueObject(expectedRefreshToken)
      );

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
      toBeSameAuthentication(expected: Authentication): R;
    }
  }
}
