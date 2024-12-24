import { Status } from 'aspects/http';
import { UserIdentifier } from 'domains/user';
import { Builder } from 'tests/factories';
import { UserIdentifierFactory } from 'tests/factories/domains/user';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

export type Overrides = UserIdentifier;

export class DeleteResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/users/delete';

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(UserIdentifierFactory).build());
  }

  public code(): string {
    return `${DeleteResource.CODE_PREFIX}/${this.overrides.value}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'DELETE') {
      return false;
    }

    if (!uri.startsWith(`/users/${this.overrides.value}`)) {
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
}
