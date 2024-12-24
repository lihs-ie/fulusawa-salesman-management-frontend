import { injectable } from 'inversify';

import { MailAddress } from 'domains/common';
import { UniversallyUniqueIdentifier } from 'domains/common/identifier';
import { Password } from 'domains/user';
import { UserIdentifier } from 'domains/user/common';

import { Token, TokenType } from './token';

export class AuthenticationIdentifier extends UniversallyUniqueIdentifier {
  public constructor(value: string) {
    super(value);
  }
}

export class Authentication {
  public constructor(
    public readonly identifier: AuthenticationIdentifier,
    public readonly user: UserIdentifier,
    public readonly accessToken: Token | null,
    public readonly refreshToken: Token | null
  ) {
    if (accessToken && accessToken.type !== TokenType.ACCESS) {
      throw new Error('Access token must be of type ACCESS.');
    }

    if (refreshToken && refreshToken.type !== TokenType.REFRESH) {
      throw new Error('Refresh token must be of type REFRESH.');
    }
  }

  public isExpired(type: TokenType): boolean {
    const token = type === TokenType.ACCESS ? this.accessToken : this.refreshToken;

    if (!token) {
      return true;
    }

    return token.expiresAt < new Date();
  }
}

@injectable()
export abstract class Repository {
  abstract login(
    identifier: AuthenticationIdentifier,
    email: MailAddress,
    password: Password
  ): Promise<Authentication>;

  abstract logout(identifier: AuthenticationIdentifier): Promise<void>;

  abstract refresh(value: string): Promise<Authentication>;

  abstract revoke(value: string, type: TokenType): Promise<void>;

  abstract introspect(value: string, type: TokenType): Promise<boolean>;
}
