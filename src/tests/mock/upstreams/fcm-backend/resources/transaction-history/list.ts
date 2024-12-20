import { List } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/transaction-history/templates';
import { TransactionHistory, Criteria } from 'domains/transaction-history';
import { Builder } from 'tests/factories/common';
import {
  TransactionHistoryFactory,
  CriteriaFactory,
} from 'tests/factories/domains/transaction-history';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

import { TransactionHistoriesMedia } from '../../media';

export type Overrides = {
  model?: List<TransactionHistory>;
  media?: Partial<RawEntriesMedia>;
  identifier?: Criteria;
};

type Query = Partial<{
  user: string;
  customer: string;
  sort: string;
}>;

export class ListResource extends Resource<CommonType, Overrides, Query> {
  private static readonly CODE_PREFIX = 'fcm-backend/transaction-histories';
  private readonly media: TransactionHistoriesMedia;
  private readonly identifier: Criteria;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(
      type,
      overrides ?? {
        model: Builder.get(TransactionHistoryFactory).buildList(Math.floor(Math.random() * 20) + 1),
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

    if (!uri.startsWith(`/transaction-histories?`)) {
      return false;
    }

    const query = this.parseQuery(uri);

    if (query.user !== this.identifier.user?.value) {
      return false;
    }

    if (query.customer !== this.identifier.customer?.value) {
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

  private createMedia(overrides?: Overrides): TransactionHistoriesMedia {
    if (List.isList(overrides?.model)) {
      return new TransactionHistoriesMedia(overrides.model);
    }

    return new TransactionHistoriesMedia(overrides?.media);
  }
}
