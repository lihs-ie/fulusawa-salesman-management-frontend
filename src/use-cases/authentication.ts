import { injectable } from 'inversify';

import {
  AuthenticationIdentifier,
  Authentication as Entity,
  Repository,
  TokenType,
} from 'domains/authentication';
import { Password } from 'domains/user';
import { MailAddressHydrator, MailAddressPayload } from 'hydration/common/contact';

@injectable()
export class Authentication {
  public constructor(private readonly repository: Repository) {}

  public async login(
    identifier: string,
    mail: MailAddressPayload,
    password: string
  ): Promise<Entity> {
    return await this.repository.login(
      new AuthenticationIdentifier(identifier),
      MailAddressHydrator.hydrate(mail),
      new Password(password)
    );
  }

  public async logout(identifier: string): Promise<void> {
    await this.repository.logout(new AuthenticationIdentifier(identifier));
  }

  public async refresh(value: string): Promise<Entity> {
    return await this.repository.refresh(value);
  }

  public async revoke(value: string, type: TokenType): Promise<void> {
    await this.repository.revoke(value, type);
  }

  public async introspect(value: string, type: TokenType): Promise<boolean> {
    return await this.repository.introspect(value, type);
  }
}
