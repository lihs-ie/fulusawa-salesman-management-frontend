import { RawEntryMedia } from 'acl/fsm-backend/authentication/templates';
import { Authentication } from 'domains/authentication';
import { Builder } from 'tests/factories';
import { AuthenticationFactory, TokenFactory } from 'tests/factories/domains/authentication';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

import { AuthenticationMedia } from '../../media';

export type ResourceIdentifier = {
  value: string;
};

export type Overrides = {
  model?: Authentication;
  media?: RawEntryMedia;
  resource: string;
};

export class RefreshResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/authentication/refresh';
  private media: AuthenticationMedia;
  private resourceIdentifier: ResourceIdentifier;

  public constructor(type: CommonType, overrides: Overrides) {
    super(type, overrides ?? { model: Builder.get(AuthenticationFactory).build() });

    this.media = this.createMedia(overrides);
    this.resourceIdentifier = this.createIdentifier(overrides);
  }

  public code(): string {
    const resourceIdentifier = this.resourceIdentifier;

    return `${RefreshResource.CODE_PREFIX}/${resourceIdentifier.value}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'POST') {
      return false;
    }

    if (!uri.startsWith('/auth/token')) {
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

  private createIdentifier(overrides: Overrides): ResourceIdentifier {
    if (overrides.model instanceof Authentication) {
      return this.createIdentifierFromModel(overrides.model);
    }

    if (overrides.media) {
      return this.createIdentifierFromMedia(overrides.media);
    }

    return this.createDefaultIdentifier();
  }

  private createDefaultIdentifier(): ResourceIdentifier {
    return Builder.get(TokenFactory).build({ type: 'REFRESH' });
  }

  private createIdentifierFromModel(model: Authentication): ResourceIdentifier {
    return model.refreshToken
      ? { value: model.refreshToken.value }
      : this.createDefaultIdentifier();
  }

  private createIdentifierFromMedia(media: RawEntryMedia): ResourceIdentifier {
    return media.refreshToken
      ? { value: media.refreshToken.value }
      : this.createDefaultIdentifier();
  }

  private createMedia(overrides?: Overrides): AuthenticationMedia {
    if (overrides?.model instanceof Authentication) {
      return new AuthenticationMedia(overrides.model);
    }

    return new AuthenticationMedia(overrides?.media);
  }

  private matchBody(request: Request): boolean {
    const body = JSON.parse(String(request.body)) as { value: string };

    if (body.value !== this.resourceIdentifier.value) {
      return false;
    }

    return true;
  }
}
