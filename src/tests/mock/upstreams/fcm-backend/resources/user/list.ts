import { List } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/user/templates';
import { User } from 'domains/user';
import { Builder } from 'tests/factories/common';
import { UserFactory } from 'tests/factories/domains/user';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

import { UsersMedia } from '../../media';

export type Overrides = Partial<RawEntriesMedia> | List<User>;

export class ListResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/users';
  private readonly media: UsersMedia;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(
      type,
      overrides ?? Builder.get(UserFactory).buildList(Math.floor(Math.random() * 20) + 1)
    );

    this.media = new UsersMedia(overrides);
  }

  public code(): string {
    return ListResource.CODE_PREFIX;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'GET') {
      return false;
    }

    if (!uri.startsWith(`/users`)) {
      return false;
    }

    return true;
  }

  public content(): string {
    return this.media.createSuccessfulContent();
  }

  protected createSuccessfulResponse(request: Request): Response {
    return new Response(this.content());
  }
}
