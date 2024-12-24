import { injectable } from 'inversify';

import { Adaptor } from 'acl/fsm-backend/authentication/templates';
import {
  Authentication,
  AuthenticationIdentifier,
  Repository,
  TokenType,
} from 'domains/authentication';
import { MailAddress } from 'domains/common';
import { Password } from 'domains/user';

@injectable()
export class ACLAuthenticationRepository implements Repository {
  public constructor(public readonly adaptor: Adaptor) {}

  public async login(
    identifier: AuthenticationIdentifier,
    email: MailAddress,
    password: Password
  ): Promise<Authentication> {
    return await this.adaptor.login(identifier, email, password);
  }

  public async logout(identifier: AuthenticationIdentifier): Promise<void> {
    return await this.adaptor.logout(identifier);
  }

  public async refresh(value: string): Promise<Authentication> {
    return await this.adaptor.refresh(value);
  }

  public async revoke(value: string, type: TokenType): Promise<void> {
    return await this.adaptor.revoke(value, type);
  }

  public async introspect(value: string, type: TokenType): Promise<boolean> {
    return await this.adaptor.introspect(value, type);
  }
}
