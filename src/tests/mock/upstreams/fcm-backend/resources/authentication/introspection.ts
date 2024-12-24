import { IntrospectionMedia as RawIntrospectionMedia } from 'acl/fsm-backend/authentication/templates';
import { Token } from 'domains/authentication';
import { Builder } from 'tests/factories';
import { TokenFactory } from 'tests/factories/domains/authentication';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

import { IntrospectionMedia } from '../../media';

export type Overrides = Partial<RawIntrospectionMedia> & { identifier: Token };

export class IntrospectionResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/authentication/introspection';
  private media: IntrospectionMedia;

  public constructor(type: CommonType, overrides: Overrides) {
    super(type, overrides ?? Builder.get(TokenFactory).build());

    this.media = new IntrospectionMedia(this.overrides);
  }

  public code(): string {
    const identifier = this.overrides.identifier;

    return `${IntrospectionResource.CODE_PREFIX}/${identifier.value}/${identifier.type}/${identifier.expiresAt.toISOString()}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'POST') {
      return false;
    }

    if (!uri.startsWith('/auth/introspect')) {
      return false;
    }

    if (!this.matchBody(request)) {
      return false;
    }

    return true;
  }

  public content(): string {
    return this.media.createSuccessfulContent();
  }

  protected createSuccessfulResponse(_: Request): Response {
    return new Response(this.content());
  }

  private matchBody(request: Request): boolean {
    const body = JSON.parse(String(request.body)) as { value: string; type: string };

    if (body.value !== this.overrides.identifier.value) {
      return false;
    }

    if (body.type !== this.overrides.identifier.type) {
      return false;
    }

    return true;
  }
}
