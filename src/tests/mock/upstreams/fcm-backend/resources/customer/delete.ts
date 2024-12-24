import { Status } from 'aspects/http';
import { CustomerIdentifier } from 'domains/customer';
import { Builder } from 'tests/factories';
import { CustomerIdentifierFactory } from 'tests/factories/domains/customer';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

export type Overrides = CustomerIdentifier;

export class DeleteResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/customers/delete';

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(CustomerIdentifierFactory).build());
  }

  public code(): string {
    return `${DeleteResource.CODE_PREFIX}/${this.overrides.value}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'DELETE') {
      return false;
    }

    if (!uri.startsWith(`/customers/${this.overrides.value}`)) {
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
