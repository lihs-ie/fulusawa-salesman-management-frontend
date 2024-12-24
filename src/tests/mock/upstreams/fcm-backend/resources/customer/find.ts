import { RawEntryMedia } from 'acl/fsm-backend/customer/templates';
import { Customer, CustomerIdentifier } from 'domains/customer';
import { Builder } from 'tests/factories';
import { CustomerFactory, CustomerIdentifierFactory } from 'tests/factories/domains/customer';

import { Resource, Type as CommonType } from '../../../common';
import { CustomerMedia } from '../../media';

export type Overrides = (Partial<RawEntryMedia> & { resource: CustomerIdentifier }) | Customer;

export class FindResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/customers';
  private media: CustomerMedia;
  private identifier: CustomerIdentifier;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(CustomerFactory).build());

    this.media = new CustomerMedia(this.overrides);
    this.identifier = this.createIdentifier(overrides);
  }

  public code(): string {
    return `${FindResource.CODE_PREFIX}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'GET') {
      return false;
    }

    if (!uri.startsWith(`/customers/${this.identifier.value}`)) {
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

  private createIdentifier(overrides?: Overrides): CustomerIdentifier {
    if (overrides instanceof Customer) {
      return overrides.identifier;
    }

    return overrides?.resource ?? Builder.get(CustomerIdentifierFactory).build();
  }
}
