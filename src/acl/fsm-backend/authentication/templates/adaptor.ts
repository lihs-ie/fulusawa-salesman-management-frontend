import { injectable } from 'inversify';

import { AbstractAdaptor } from 'acl/fsm-backend/common';
import { HttpMethod } from 'aspects/http';
import { Authentication, AuthenticationIdentifier, TokenType } from 'domains/authentication';
import { MailAddress } from 'domains/common';
import { Password } from 'domains/user';

import { Reader, Writer } from './media-types';
import { Translator } from './translator';

@injectable()
export abstract class Adaptor extends AbstractAdaptor {
  public constructor(
    private readonly endpoint: string,
    private readonly writer: Writer,
    protected readonly reader: Reader,
    protected readonly translator: Translator
  ) {
    super();
  }

  public abstract login(
    identifier: AuthenticationIdentifier,
    email: MailAddress,
    password: Password
  ): Promise<Authentication>;

  public abstract logout(identifier: AuthenticationIdentifier): Promise<void>;

  public abstract refresh(value: string): Promise<Authentication>;

  public abstract revoke(value: string, type: TokenType): Promise<void>;

  public abstract introspect(value: string, type: TokenType): Promise<boolean>;

  protected createLoginRequest(
    identifier: AuthenticationIdentifier,
    email: MailAddress,
    password: Password
  ): Request {
    return new Request(
      `${this.endpoint}/auth/login`,
      this.createLoginRequestOptions(identifier, email, password)
    );
  }

  protected createLogoutRequest(identifier: AuthenticationIdentifier): Request {
    return new Request(`${this.endpoint}/auth/logout`, this.createLogoutRequestOptions(identifier));
  }

  protected createRefreshRequest(value: string): Request {
    return new Request(`${this.endpoint}/auth/token`, this.createRefreshRequestOptions(value));
  }

  protected createRevokeRequest(value: string, type: TokenType): Request {
    return new Request(
      `${this.endpoint}/auth/revoke`,
      this.createRevokeRequestOptions(value, type)
    );
  }

  protected createIntrospectionRequest(value: string, type: TokenType): Request {
    return new Request(
      `${this.endpoint}/auth/introspect`,
      this.createIntrospectionRequestOptions(value, type)
    );
  }

  private createLoginRequestOptions(
    identifier: AuthenticationIdentifier,
    email: MailAddress,
    password: Password
  ): RequestInit {
    return {
      method: HttpMethod.POST,
      body: this.writer.write([identifier, email, password]),
    };
  }

  private createLogoutRequestOptions(identifier: AuthenticationIdentifier): RequestInit {
    return {
      method: HttpMethod.POST,
      body: this.writer.writeLogout(identifier),
    };
  }

  private createRefreshRequestOptions(value: string): RequestInit {
    return {
      method: HttpMethod.POST,
      body: this.writer.writeToken(value, TokenType.REFRESH),
    };
  }

  private createRevokeRequestOptions(value: string, type: TokenType): RequestInit {
    return {
      method: HttpMethod.POST,
      body: this.writer.writeToken(value, type),
    };
  }

  private createIntrospectionRequestOptions(value: string, type: TokenType): RequestInit {
    return {
      method: HttpMethod.POST,
      body: this.writer.writeToken(value, type),
    };
  }
}
