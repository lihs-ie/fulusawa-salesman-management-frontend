import { List } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/feedback/templates';
import { Feedback, Criteria } from 'domains/feedback';
import { Builder } from 'tests/factories/common';
import { FeedbackFactory, CriteriaFactory } from 'tests/factories/domains/feedback';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

import { FeedbacksMedia } from '../../media';

export type Overrides = {
  model?: List<Feedback>;
  media?: Partial<RawEntriesMedia>;
  identifier?: Criteria;
};

type Query = Partial<{
  type: string;
  status: string;
  sort: string;
}>;

export class ListResource extends Resource<CommonType, Overrides, Query> {
  private static readonly CODE_PREFIX = 'fcm-backend/feedbacks';
  private readonly media: FeedbacksMedia;
  private readonly identifier: Criteria;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(
      type,
      overrides ?? {
        model: Builder.get(FeedbackFactory).buildList(Math.floor(Math.random() * 20) + 1),
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

    if (!uri.startsWith(`/feedbacks?`)) {
      return false;
    }

    const query = this.parseQuery(uri);

    if (query.type !== (this.identifier.type ?? undefined)) {
      return false;
    }

    if (query.status !== (this.identifier.status ?? undefined)) {
      return false;
    }

    if (query.sort !== (this.identifier.sort ?? undefined)) {
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

  private createMedia(overrides?: Overrides): FeedbacksMedia {
    if (List.isList(overrides?.model)) {
      return new FeedbacksMedia(overrides.model);
    }

    return new FeedbacksMedia(overrides?.media);
  }
}
