import { hash } from 'immutable';

import { Status } from 'aspects/http';
import { Authentication, TokenType } from 'domains/authentication';
import { Builder, StringFactory } from 'tests/factories';
import { AuthenticationFactory } from 'tests/factories/domains/authentication';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

export type ResourceIdentifier = {
  accessToken: string;
  refreshToken: string;
};

export type Overrides = {
  model?: Authentication;
  resource?: ResourceIdentifier;
};

export class RevokeResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/authentication/revoke';
  private resourceIdentifier: ResourceIdentifier;

  public constructor(type: CommonType, overrides: Overrides) {
    super(type, overrides ?? { model: Builder.get(AuthenticationFactory).build() });

    this.resourceIdentifier = this.createIdentifier(overrides);
  }

  public code(): string {
    return `${RevokeResource.CODE_PREFIX}/${this.resourceIdentifier.accessToken}/${this.resourceIdentifier.refreshToken}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'POST') {
      return false;
    }

    if (!uri.startsWith('/auth/revoke')) {
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
    return new Response(this.content(), { status: Status.NO_CONTENT });
  }

  private createIdentifier(overrides?: Overrides): ResourceIdentifier {
    if (overrides?.model instanceof Authentication) {
      return this.createIdentifierFromModel(overrides.model);
    }

    return this.createDefaultIdentifier();
  }

  private createDefaultIdentifier(): ResourceIdentifier {
    return {
      accessToken: hash(Builder.get(StringFactory(1, 255)).build()).toString(),
      refreshToken: hash(Builder.get(StringFactory(1, 255)).build()).toString(),
    };
  }

  private createIdentifierFromModel(model: Authentication): ResourceIdentifier {
    return {
      accessToken:
        model.accessToken?.value ?? hash(Builder.get(StringFactory(1, 255)).build()).toString(),
      refreshToken:
        model.refreshToken?.value ?? hash(Builder.get(StringFactory(1, 255)).build()).toString(),
    };
  }

  private matchBody(request: Request): boolean {
    const body = JSON.parse(String(request.body)) as { value: string; type: TokenType };

    if (body.type === 'ACCESS') {
      if (body.value !== this.resourceIdentifier.accessToken) {
        return false;
      }
    } else {
      if (body.value !== this.resourceIdentifier.refreshToken) {
        return false;
      }
    }

    return true;
  }
}
