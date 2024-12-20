import { List } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/cemetery/templates';
import { Cemetery, Criteria } from 'domains/cemetery';
import { Builder } from 'tests/factories/common';
import { CemeteryFactory, CriteriaFactory } from 'tests/factories/domains/cemetery';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

import { CemeteriesMedia } from '../../media';

export type Overrides = {
  model?: List<Cemetery>;
  media?: Partial<RawEntriesMedia>;
  identifier?: Criteria;
};

type Query = Partial<{
  customer: string;
}>;

export class ListResource extends Resource<CommonType, Overrides, Query> {
  private static readonly CODE_PREFIX = 'fcm-backend/cemeteries';
  private readonly media: CemeteriesMedia;
  private readonly identifier: Criteria;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(
      type,
      overrides ?? {
        model: Builder.get(CemeteryFactory).buildList(Math.floor(Math.random() * 20) + 1),
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

    if (!uri.startsWith(`/cemeteries?`)) {
      return false;
    }

    const query = this.parseQuery(uri);

    if (query.customer !== this.identifier.customer?.value) {
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

  private createIdentifier(overrides?: Overrides): Criteria {
    if (List.isList(overrides)) {
      return this.createDefaultIdentifier();
    }

    return overrides?.identifier ?? this.createDefaultIdentifier();
  }

  private createDefaultIdentifier(): Criteria {
    return Builder.get(CriteriaFactory).build();
  }

  private createMedia(overrides?: Overrides): CemeteriesMedia {
    if (List.isList(overrides?.model)) {
      return new CemeteriesMedia(overrides.model);
    }

    return new CemeteriesMedia(overrides?.media);
  }
}
