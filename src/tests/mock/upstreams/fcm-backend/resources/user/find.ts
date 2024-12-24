import { RawEntryMedia } from 'acl/fsm-backend/user/templates';
import { User, UserIdentifier } from 'domains/user';
import { Builder } from 'tests/factories';
import { UserFactory, UserIdentifierFactory } from 'tests/factories/domains/user';

import { Resource, Type as CommonType } from '../../../common';
import { UserMedia } from '../../media';

export type Overrides = (Partial<RawEntryMedia> & { resource: UserIdentifier }) | User;

export class FindResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/users';
  private media: UserMedia;
  private identifier: UserIdentifier;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(UserFactory).build());

    this.media = new UserMedia(this.overrides);
    this.identifier = this.createIdentifier(overrides);
  }

  public code(): string {
    return `${FindResource.CODE_PREFIX}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'GET') {
      return false;
    }

    if (!uri.startsWith(`/users/${this.identifier.value}`)) {
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

  private createIdentifier(overrides?: Overrides): UserIdentifier {
    if (overrides instanceof User) {
      return overrides.identifier;
    }

    return overrides?.resource ?? Builder.get(UserIdentifierFactory).build();
  }
}
