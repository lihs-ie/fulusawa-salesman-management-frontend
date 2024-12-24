import { Body } from 'acl/fsm-backend/authentication/templates';
import { AuthenticationIdentifier } from 'domains/authentication';
import { Builder } from 'tests/factories';
import { AuthenticationIdentifierFactory } from 'tests/factories/domains/authentication';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

export type Overrides = { identifier: AuthenticationIdentifier };

export class LogoutResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/authentication/logout';

  public constructor(type: CommonType, overrides: Overrides) {
    super(type, overrides ?? Builder.get(AuthenticationIdentifierFactory).build());
  }

  public code(): string {
    return `${LogoutResource.CODE_PREFIX}/${this.overrides.identifier.value}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'POST') {
      return false;
    }

    if (!uri.startsWith('/auth/logout')) {
      return false;
    }

    if (!this.matchBody(request)) {
      return false;
    }

    return true;
  }

  public content(): string {
    return '';
  }

  protected createSuccessfulResponse(_: Request): Response {
    return new Response(this.content(), { status: 204 });
  }

  private matchBody(request: Request): boolean {
    const body = JSON.parse(String(request.body)) as Body;

    if (body.identifier !== this.overrides.identifier.value) {
      return false;
    }

    return true;
  }
}
