import { injectable } from 'inversify';

import { Authentication, AuthenticationIdentifier, TokenType } from 'domains/authentication';
import { MailAddress } from 'domains/common';
import { Password } from 'domains/user';

import { Adaptor as BaseAdaptor, Reader, Translator, Writer } from '../templates';

@injectable()
export class Adaptor extends BaseAdaptor {
  public constructor(endpoint: string, writer: Writer, reader: Reader, translator: Translator) {
    super(endpoint, writer, reader, translator);
  }

  public async login(
    identifier: AuthenticationIdentifier,
    email: MailAddress,
    password: Password
  ): Promise<Authentication> {
    const request = this.createLoginRequest(identifier, email, password);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }

    const content = await response.text();

    const media = this.reader.read(content);

    return this.translator.translate(media);
  }

  public async logout(identifier: AuthenticationIdentifier): Promise<void> {
    const request = this.createLogoutRequest(identifier);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }
  }

  public async refresh(value: string): Promise<Authentication> {
    const request = this.createRefreshRequest(value);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }

    const content = await response.text();

    const media = this.reader.read(content);

    return this.translator.translate(media);
  }

  public async revoke(value: string, type: TokenType): Promise<void> {
    const request = this.createRevokeRequest(value, type);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }
  }

  public async introspect(value: string, type: TokenType): Promise<boolean> {
    const request = this.createIntrospectionRequest(value, type);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }

    const content = await response.text();

    const media = this.reader.readIntrospection(content);

    return media.active;
  }
}
