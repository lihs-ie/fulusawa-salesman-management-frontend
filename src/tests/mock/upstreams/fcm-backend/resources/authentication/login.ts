import { Body, RawEntryMedia } from 'acl/fsm-backend/authentication/templates';
import { Authentication, AuthenticationIdentifier } from 'domains/authentication';
import { MailAddress } from 'domains/common';
import { Password } from 'domains/user';
import { Builder } from 'tests/factories';
import {
  AuthenticationFactory,
  AuthenticationIdentifierFactory,
} from 'tests/factories/domains/authentication';
import { MailAddressFactory } from 'tests/factories/domains/common/contact';
import { PasswordFactory } from 'tests/factories/domains/user';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

import { AuthenticationMedia } from '../../media';

export type ResourceIdentifier = {
  identifier: AuthenticationIdentifier;
  email: MailAddress;
  password: Password;
};

export type Overrides = {
  model?: Authentication;
  media?: RawEntryMedia;
  resource: ResourceIdentifier;
};

export class LoginResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/authentication/login';
  private media: AuthenticationMedia;
  private resourceIdentifier: ResourceIdentifier;

  public constructor(type: CommonType, overrides: Overrides) {
    super(type, overrides ?? { model: Builder.get(AuthenticationFactory).build() });

    this.media = this.createMedia(overrides);
    this.resourceIdentifier = this.createIdentifier(overrides);
  }

  public code(): string {
    const resourceIdentifier = this.resourceIdentifier;

    const suffix = `${resourceIdentifier.identifier.value}/${resourceIdentifier.email.toString()}/${resourceIdentifier.password.value}`;

    return `${LoginResource.CODE_PREFIX}/${suffix}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'POST') {
      return false;
    }

    if (!uri.startsWith('/auth/login')) {
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
      return this.createIdentifierFromModel(overrides.model, overrides.resource);
    }

    if (overrides.media) {
      return this.createIdentifierFromMedia(overrides.media, overrides.resource);
    }

    return this.createDefaultIdentifier();
  }

  private createDefaultIdentifier(): ResourceIdentifier {
    return {
      identifier: Builder.get(AuthenticationIdentifierFactory).build(),
      email: Builder.get(MailAddressFactory).build(),
      password: Builder.get(PasswordFactory).build(),
    };
  }

  private createIdentifierFromModel(
    model: Authentication,
    resource: ResourceIdentifier
  ): ResourceIdentifier {
    if (!model.identifier.equals(resource.identifier)) {
      throw new Error('Model identifier does not match resource identifier');
    }

    return {
      identifier: resource.identifier,
      email: resource.email,
      password: resource.password,
    };
  }

  private createIdentifierFromMedia(
    media: RawEntryMedia,
    resource: Omit<ResourceIdentifier, 'identifier'>
  ): ResourceIdentifier {
    return {
      identifier: new AuthenticationIdentifier(media.identifier),
      email: resource.email,
      password: resource.password,
    };
  }

  private createMedia(overrides?: Overrides): AuthenticationMedia {
    if (overrides?.model instanceof Authentication) {
      return new AuthenticationMedia(overrides.model);
    }

    return new AuthenticationMedia(overrides?.media);
  }

  private matchBody(request: Request): boolean {
    const body = JSON.parse(String(request.body)) as Body;

    if (body.identifier !== this.resourceIdentifier.identifier.value) {
      return false;
    }

    if (body.email !== this.resourceIdentifier.email.toString()) {
      return false;
    }

    if (body.password !== this.resourceIdentifier.password.value) {
      return false;
    }

    return true;
  }
}
