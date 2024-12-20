import { List } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/schedule/templates';
import { Schedule, Criteria } from 'domains/schedule';
import { Builder } from 'tests/factories/common';
import { ScheduleFactory, CriteriaFactory } from 'tests/factories/domains/schedule';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

import { SchedulesMedia } from '../../media';

export type Overrides = {
  model?: List<Schedule>;
  media?: Partial<RawEntriesMedia>;
  identifier?: Criteria;
};

type Query = Partial<{
  date: string;
  title: string;
  status: string;
  user: string;
}>;

export class ListResource extends Resource<CommonType, Overrides, Query> {
  private static readonly CODE_PREFIX = 'fcm-backend/schedules';
  private readonly media: SchedulesMedia;
  private readonly identifier: Criteria;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(
      type,
      overrides ?? {
        model: Builder.get(ScheduleFactory).buildList(Math.floor(Math.random() * 20) + 1),
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

    if (!uri.startsWith(`/schedules?`)) {
      return false;
    }

    const query = this.parseQuery(uri);

    if (query.date) {
      if (this.identifier.date === null) {
        return false;
      }

      const comparand = JSON.parse(query.date) as { start: string | null; end: string | null };

      if (this.identifier.date.min?.toISOString() !== (comparand.start ?? undefined)) {
        return false;
      }

      if (this.identifier.date.max?.toISOString() !== (comparand.end ?? undefined)) {
        return false;
      }
    } else {
      if (this.identifier.date !== null) {
        return false;
      }
    }

    if (query.user !== (this.identifier.user?.value ?? undefined)) {
      return false;
    }

    if (query.status !== (this.identifier.status ?? undefined)) {
      return false;
    }

    if (query.title !== (this.identifier.title ?? undefined)) {
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

  private createMedia(overrides?: Overrides): SchedulesMedia {
    if (List.isList(overrides?.model)) {
      return new SchedulesMedia(overrides.model);
    }

    return new SchedulesMedia(overrides?.media);
  }
}
