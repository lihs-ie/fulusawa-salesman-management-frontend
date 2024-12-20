import { List } from 'immutable';

import { AddressMedia, PhoneNumberMedia } from 'acl/fsm-backend/common';
import { RawEntriesMedia } from 'acl/fsm-backend/customer/templates';
import { Customer, Criteria } from 'domains/customer';
import { Builder } from 'tests/factories/common';
import { CustomerFactory, CriteriaFactory } from 'tests/factories/domains/customer';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

import { CustomersMedia } from '../../media';

export type Overrides = {
  model?: List<Customer>;
  media?: Partial<RawEntriesMedia>;
  identifier?: Criteria;
};

type Query = Partial<{
  name: string;
  postalCode: string;
  phone: string;
}>;

export class ListResource extends Resource<CommonType, Overrides, Query> {
  private static readonly CODE_PREFIX = 'fcm-backend/customers';
  private readonly media: CustomersMedia;
  private readonly identifier: Criteria;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(
      type,
      overrides ?? {
        model: Builder.get(CustomerFactory).buildList(Math.floor(Math.random() * 20) + 1),
      }
    );

    this.identifier = this.createIdentifier(this.overrides);
    this.media = this.createMedia(this.overrides);
  }

  public code(): string {
    const criteria = this.identifier;

    const suffix = Object.entries(criteria)
      .map(([key, value]) => `${key}=${value}`)
      .join('/');

    return `${ListResource.CODE_PREFIX}/${suffix}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'GET') {
      return false;
    }

    if (!uri.startsWith(`/customers?`)) {
      return false;
    }

    const query = this.parseQuery(uri);

    if (query.name !== (this.identifier.name ?? undefined)) {
      return false;
    }

    if (query.postalCode) {
      if (this.identifier.postalCode === null) {
        return false;
      }

      const comparand: AddressMedia['postalCode'] = JSON.parse(query.postalCode);

      if (comparand.first !== this.identifier.postalCode.first) {
        return false;
      }

      if (comparand.second !== this.identifier.postalCode.second) {
        return false;
      }
    } else {
      if (this.identifier.postalCode !== null) {
        return false;
      }
    }

    if (query.phone) {
      if (this.identifier.phone === null) {
        return false;
      }
      const comparand: PhoneNumberMedia = JSON.parse(query.phone);

      if (comparand.areaCode !== this.identifier.phone.areaCode) {
        return false;
      }

      if (comparand.localCode !== this.identifier.phone.localCode) {
        return false;
      }

      if (comparand.subscriberNumber !== this.identifier.phone.subscriberNumber) {
        return false;
      }
    } else {
      if (this.identifier.phone !== null) {
        return false;
      }
    }

    return true;
  }

  public content(): string {
    return this.media.createSuccessfulContent();
  }

  protected createSuccessfulResponse(request: Request): Response {
    return new Response(this.content());
  }

  private createIdentifier(overrides?: Overrides): Criteria {
    if (List.isList(overrides)) {
      return this.createDefaultIdentifier();
    }

    return overrides?.identifier ?? this.createDefaultIdentifier();
  }

  private createDefaultIdentifier(): Criteria {
    return Builder.get(CriteriaFactory).build();
  }

  private createMedia(overrides?: Overrides): CustomersMedia {
    if (List.isList(overrides?.model)) {
      return new CustomersMedia(overrides.model);
    }

    return new CustomersMedia(overrides?.media);
  }
}
